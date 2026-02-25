"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { wishlistAPI } from "@/lib/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const { token } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [wishlistIds, setWishlistIds] = useState([]);
    const [loading, setLoading] = useState(false);

    const getWishlist = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const { data } = await wishlistAPI.getWishlist();
            setWishlist(data.data);
            setWishlistIds(data.data.map((item) => item._id || item.id));
        } catch {
            setWishlist([]);
            setWishlistIds([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        getWishlist();
    }, [getWishlist]);

    async function addToWishlist(productId) {
        if (!token) {
            toast.error("Please login first");
            return false;
        }
        try {
            const { data } = await wishlistAPI.addToWishlist(productId);
            setWishlistIds(data.data);
            toast.success("Added to wishlist ❤️");
            return true;
        } catch {
            toast.error("Failed to add to wishlist");
            return false;
        }
    }

    async function removeFromWishlist(productId) {
        try {
            const { data } = await wishlistAPI.removeFromWishlist(productId);
            setWishlistIds(data.data);
            setWishlist((prev) => prev.filter((item) => (item._id || item.id) !== productId));
            toast.success("Removed from wishlist");
        } catch {
            toast.error("Failed to remove");
        }
    }

    function isInWishlist(productId) {
        return wishlistIds.includes(productId);
    }

    async function toggleWishlist(productId) {
        if (isInWishlist(productId)) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    }

    return (
        <WishlistContext.Provider
            value={{ wishlist, wishlistIds, loading, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, getWishlist }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
    return ctx;
}
