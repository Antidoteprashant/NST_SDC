import React, { useLayoutEffect, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Ksenia K's Vertex Shader
const vertexShaderSource = `
    precision mediump float;
    varying vec2 vUv;
    attribute vec2 a_position;

    void main() {
        vUv = a_position;
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

// Ksenia K's Fragment Shader (Exact copy with slight params adjustment for theme)
const fragmentShaderSource = `
    precision mediump float;

    varying vec2 vUv;
    uniform vec2 u_resolution;
    uniform float u_scroll_progr;
    uniform float u_col_width;
    uniform float u_seed;
    uniform float u_scale;
    uniform float u_time;
    uniform float u_speed;
    uniform vec3 u_color;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }

    float get_l(vec2 v) {
        return 1. - clamp(0., 1., length(v));
    }

    float rand(float n) {
        return fract(sin(n) * 43758.5453123);
    }

    void main() {
        float scale = .001 * u_scale;
        float speed = .001 * u_speed;

        vec2 uv = vUv;
        uv.x *= (scale * u_resolution.x);

        vec2 noise_uv = uv;
        noise_uv *= 5.;
        noise_uv.y *= (.25 * scale * u_resolution.y);
        noise_uv += vec2(0., u_time * 1.5 * speed);
        float shape = 0.;
        shape += snoise(noise_uv);
        shape = clamp(.5 + .5 * shape, 0., 1.);
        shape *= pow(.5 * uv.y + .7 + pow(u_scroll_progr, 2.) + (.4 * u_scroll_progr * (1. - pow(vUv.x - .2, 2.))), 10.);
        shape = clamp(shape, 0., 1.);

        float dots = 0.;
        float bars = 0.;
        float light = 0.;

        const int num_col = 9;
        for (int i = 0; i < num_col; i++) {

            vec2 col_uv = vUv;

            float start_time_offset = rand(100. * (float(i) + u_seed));
            float c_t = fract(u_time * speed + start_time_offset);
            float drop_time = .2 + .6 * rand(10. * (float(i) + u_seed));

            float before_drop_normal = c_t / drop_time;
            float before_drop_t = pow(before_drop_normal, .4) * drop_time;
            float after_drop_normal = max(0., c_t - drop_time) / (1. - drop_time);
            float after_drop_t_dot = 3. * pow(after_drop_normal, 2.) * (1. - drop_time);
            float after_drop_t_bar = pow(after_drop_normal, 2.) * (drop_time);

            float eased_drop_t = step(c_t, drop_time) * before_drop_t;
            eased_drop_t += step(drop_time, c_t) * (drop_time + after_drop_t_dot);

            col_uv.y += (1. + 3. * rand(15. * float(i))) * u_scroll_progr;

            col_uv.x *= (u_resolution.x / u_resolution.y);
            col_uv *= (7. * scale * u_resolution.y);

            col_uv.x += (u_col_width * (.5 * float(num_col) - float(i)));

            vec2 dot_uv = col_uv;
            dot_uv.y += 4. * (eased_drop_t - .5);

            float dot = get_l(dot_uv);
            dot = pow(dot, 4.);

            float drop_grow = step(c_t, drop_time) * pow(before_drop_normal, .4);
            drop_grow += step(drop_time, c_t) * mix(1., .8, clamp(7. * after_drop_normal, 0., 1.));
            dot *= drop_grow;

            dot *= step(.5, drop_time);
            dots += dot;

            vec2 bar_uv = col_uv;
            bar_uv.y += step(c_t, drop_time) * 4. * (before_drop_t - .5);
            bar_uv.y += step(drop_time, c_t) * 4. * (drop_time - after_drop_t_bar - .5);

            float bar = smoothstep(-.5, 0., bar_uv.x) * (1. - smoothstep(0., .5, bar_uv.x));
            bar = pow(bar, 4.);
            light += bar * smoothstep(.0, .1, -bar_uv.x);
            float bar_mask = smoothstep(-.2, .2, bar_uv.y);
            bar *= bar_mask;

            bars += bar;
        }

        shape += bars;
        shape = clamp(shape, 0., 1.);
        shape += dots;

        float gooey = smoothstep(.48, .5, shape);
        gooey -= .1 * smoothstep(.5, .6, shape);
        
        vec3 color = u_color;
        
        // Slight gradient adjustment
        color.r += .2 * (1. - vUv.y) * (1. - u_scroll_progr);
        
        color *= gooey;
        
        // Light / Shine calculation
        vec3 shine = vec3(1.);
        color = mix(color, shine, max(0., 1. - 2. * vUv.y) * light * smoothstep(.1, .7, snoise(.5 * uv)) * (smoothstep(.49, .6, shape) - smoothstep(.6, 1., shape)));

        gl_FragColor = vec4(color, gooey); // gooey used as alpha
    }
`;

const Hero = () => {
    const comp = useRef(null);
    const canvasRef = useRef(null);
    const titleRef = useRef(null);
    const paramsRef = useRef({ scrollProgress: 0 });

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        let animationFrameId;

        if (!gl) {
            console.error("WebGL not supported");
            return;
        }

        // --- Shader Init ---
        const createShader = (gl, type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error("Shader Compile Error:", gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        const program = gl.createProgram();
        gl.attachShader(program, vertShader);
        gl.attachShader(program, fragShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Program Link Error:", gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        // --- Buffers ---
        const positionLocation = gl.getAttribLocation(program, "a_position");
        const vertices = new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0]);
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // --- Uniforms ---
        const uniforms = {};
        const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            const info = gl.getActiveUniform(program, i);
            uniforms[info.name] = gl.getUniformLocation(program, info.name);
        }

        // --- Params (Matches Theme) ---
        // White goo on transparency (to sit over black background)
        const shaderParams = {
            colWidth: 0.7,
            speed: 0.2,
            scale: 0.25,
            seed: 0.231,
            color: [1.0, 1.0, 1.0] // White
        };

        const resize = () => {
            const pixelRatio = Math.min(window.devicePixelRatio, 2);
            canvas.width = window.innerWidth * pixelRatio;
            canvas.height = window.innerHeight * pixelRatio;
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
        };
        window.addEventListener('resize', resize);
        resize();

        // --- Initial Uniforms ---
        gl.uniform1f(uniforms.u_col_width, shaderParams.colWidth);
        gl.uniform1f(uniforms.u_speed, shaderParams.speed);
        gl.uniform1f(uniforms.u_scale, shaderParams.scale);
        gl.uniform1f(uniforms.u_seed, shaderParams.seed);
        gl.uniform3f(uniforms.u_color, shaderParams.color[0], shaderParams.color[1], shaderParams.color[2]);

        // --- Visibility Check (Optimization) ---
        let isVisible = true;
        const observer = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
            if (isVisible && !animationFrameId) {
                render(); // Restart loop if visible and not running
            }
        }, { threshold: 0 });

        // Observe the canvas or the section
        observer.observe(canvas);

        // --- Render Loop ---
        const render = () => {
            if (!isVisible) {
                animationFrameId = null;
                return; // Stop the loop
            }

            const currentTime = performance.now();
            gl.uniform1f(uniforms.u_time, currentTime);
            gl.uniform1f(uniforms.u_scroll_progr, paramsRef.current.scrollProgress);

            // Important: Handle Transparency
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            animationFrameId = requestAnimationFrame(render);
        };
        render();


        // --- GSAP Scroll Interaction ---
        // We pin the hero for a bit to let the goo "drip" before scrolling away
        let ctx = gsap.context(() => {

            // The effect depends on 'scrollProgress' going 0 -> 1
            gsap.to(paramsRef.current, {
                scrollProgress: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: comp.current,
                    start: "top top",
                    end: "+=150%", // Extended drag
                    scrub: 1
                    // pin: true (Disabled to fix scroll freeze)
                }
            });

            // Text Animations
            gsap.from(titleRef.current, {
                opacity: 0,
                y: 50,
                duration: 1.5,
                ease: "power3.out"
            });

        }, comp);


        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
            ctx.revert();
            observer.disconnect();
            // Optional: WebGL cleanup if needed (delete buffers/programs)
        };
    }, []);

    return (
        <section
            id="hero"
            ref={comp}
            className="full-screen flex-center hero-section"
            style={{
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--bg-color)' // Matt Black
            }}
        >

            {/* The Shader Canvas */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1,
                    pointerEvents: 'none'
                }}
            />

            {/* Content sits on top or behaves with the goo */}
            <div className="hero-content" style={{ zIndex: 10, textAlign: 'center', mixBlendMode: 'difference' }}>
                <h1
                    ref={titleRef}
                    style={{
                        fontSize: 'clamp(4rem, 12vw, 9rem)',
                        fontFamily: 'monospace',
                        marginBottom: '1rem',
                        color: '#fff',
                        textTransform: 'uppercase',
                        letterSpacing: '-5px'
                    }}
                >
                    bawk
                </h1>

                <p style={{
                    fontSize: '1.2rem',
                    color: 'rgba(255,255,255,0.6)',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    margin: '20px 0'
                }}>
                    Scroll to Initiate
                </p>

                <div className="arrow-animated" style={{ fontSize: '2rem', color: '#fff' }}>↓</div>
            </div>

            <style>{`
                .arrow-animated {
                    animation: arrow-float 1.5s infinite ease-in-out;
                }
                @keyframes arrow-float {
                    0%, 100% { transform: translateY(0); opacity: 0.5; }
                    50% { transform: translateY(10px); opacity: 1; }
                }
            `}</style>
        </section>
    );
};

export default Hero;
