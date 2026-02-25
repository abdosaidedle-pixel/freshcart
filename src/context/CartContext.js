"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartAPI } from "@/lib/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
    const { token } = useAuth();
    const [cart, setCart] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const getCart = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const { data } = await cartAPI.getCart();
            setCart(data.data);
            setCartCount(data.numOfCartItems);
        } catch {
            setCart(null);
            setCartCount(0);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        getCart();
    }, [getCart]);

    async function addToCart(productId) {
        if (!token) {
            toast.error("Please login first");
            return false;
        }
        try {
            const { data } = await cartAPI.addToCart(productId);
            setCart(data.data);
            setCartCount(data.numOfCartItems);
            toast.success("Product added to cart ✅");
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add");
            return false;
        }
    }

    async function updateQuantity(productId, count) {
        try {
            const { data } = await cartAPI.updateQuantity(productId, count);
            setCart(data.data);
            setCartCount(data.numOfCartItems);
            toast.success("Cart updated");
        } catch {
            toast.error("Failed to update");
        }
    }

    async function removeItem(productId) {
        try {
            const { data } = await cartAPI.removeItem(productId);
            setCart(data.data);
            setCartCount(data.numOfCartItems);
            toast.success("Item removed");
        } catch {
            toast.error("Failed to remove");
        }
    }

    async function clearCart() {
        try {
            await cartAPI.clearCart();
            setCart(null);
            setCartCount(0);
            toast.success("Cart cleared");
        } catch {
            toast.error("Failed to clear");
        }
    }

    return (
        <CartContext.Provider
            value={{ cart, cartCount, loading, addToCart, updateQuantity, removeItem, clearCart, getCart }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}
