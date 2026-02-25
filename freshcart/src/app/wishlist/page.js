"use client";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";
import Link from "next/link";
import Loading from "@/components/Loading";
import { useEffect } from "react";

export default function WishlistPage() {
    const { token } = useAuth();
    const { wishlist, loading, removeFromWishlist, getWishlist } = useWishlist();
    const { addToCart } = useCart();

    useEffect(() => {
        if (token) getWishlist();
    }, [token]);

    if (!token) {
        return (
            <div className="wishlist-page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-icon">🔒</div>
                        <h2>Please login first</h2>
                        <p>You need to login to view your wishlist</p>
                        <Link href="/login" className="btn-shop-now">Login</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) return <Loading />;

    if (!wishlist || wishlist.length === 0) {
        return (
            <div className="wishlist-page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-icon">❤️</div>
                        <h2>Your wishlist is empty</h2>
                        <p>Save items you love to your wishlist</p>
                        <Link href="/products" className="btn-shop-now">Browse Products</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <div className="container">
                <h1>My Wishlist</h1>
                <p style={{ color: "#6c757d", marginBottom: 24 }}>{wishlist.length} items saved</p>

                {wishlist.map((item) => (
                    <div key={item._id || item.id} className="wishlist-item">
                        <img src={item.imageCover} alt={item.title} />
                        <div className="wishlist-item-info">
                            <h3>{item.title?.split(" ").slice(0, 4).join(" ")}</h3>
                            <p className="wishlist-item-price">{item.price} EGP</p>
                            <p style={{ fontSize: "0.8rem", color: "#6c757d" }}>{item.category?.name}</p>
                        </div>
                        <div className="wishlist-item-actions">
                            <button
                                className="btn-add-from-wish"
                                onClick={() => addToCart(item._id || item.id)}
                            >
                                <FiShoppingCart style={{ marginRight: 6 }} />
                                Add to Cart
                            </button>
                            <button
                                className="btn-remove-wish"
                                onClick={() => removeFromWishlist(item._id || item.id)}
                            >
                                <FiTrash2 style={{ marginRight: 6 }} />
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
