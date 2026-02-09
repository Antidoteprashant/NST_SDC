import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: productData, error: productError } = await supabase
                .from('products')
                .select('*')
                .eq('status', 'active') // Only fetch active products
                .order('created_at', { ascending: false });

            if (productError) throw productError;
            setProducts(productData || []);

            const { data: categoryData, error: categoryError } = await supabase
                .from('categories')
                .select('*')
                .order('created_at', { ascending: false });

            if (categoryError) throw categoryError;
            setCategories(categoryData || []);

        } catch (error) {
            console.error("Error fetching shop data:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ShopContext.Provider value={{
            products,
            categories,
            loading,
            refreshData: fetchData
        }}>
            {children}
        </ShopContext.Provider>
    );
};
