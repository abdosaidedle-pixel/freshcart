"use client";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import Link from "next/link";
import Loading from "@/components/Loading";

export default function CartPage() {
    const { token } = useAuth();
    const { cart, cartCount, loading, updateQuantity, removeItem, clearCart } = useCart();

    if (!token) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-icon">🔒</div>
                        <h2>Please login first</h2>
                        <p>You need to login to view your cart</p>
                        <Link href="/login" className="btn-shop-now">Login</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) return <Loading />;

    if (!cart || !cart.products || cart.products.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Start adding products to your cart</p>
                        <Link href="/products" className="btn-shop-now">Shop Now</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1>Shopping Cart</h1>
                <p style={{ color: "#6c757d", marginBottom: 20 }}>{cartCount} items in your cart</p>

                <div className="cart-total-bar">
                    <h3>Total: {cart.totalCartPrice} EGP</h3>
                    <button className="btn-clear-cart" onClick={clearCart}>
                        Clear Cart
                    </button>
                </div>

                {cart.products.map((item) => (
                    <div key={item._id} className="cart-item">
                        <img
                            src={item.product.imageCover}
                            alt={item.product.title}
                            className="cart-item-img"
                        />
                        <div className="cart-item-info">
                            <h3>{item.product.title?.split(" ").slice(0, 4).join(" ")}</h3>
                            <p className="cart-item-price">{item.price} EGP</p>
                            <p style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                                {item.product.category?.name}
                            </p>
                        </div>
                        <div className="cart-item-actions">
                            <button
                                className="qty-btn"
                                onClick={() => updateQuantity(item.product._id || item.product.id, item.count - 1)}
                                disabled={item.count <= 1}
                            >
                                <FiMinus />
                            </button>
                            <span className="qty-display">{item.count}</span>
                            <button
                                className="qty-btn"
                                onClick={() => updateQuantity(item.product._id || item.product.id, item.count + 1)}
                            >
                                <FiPlus />
                            </button>
                            <button
                                className="btn-remove-item"
                                onClick={() => removeItem(item.product._id || item.product.id)}
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    </div>
                ))}

                <div className="cart-checkout-section">
                    <Link href="/checkout" className="btn-checkout">
                        Proceed to Checkout →
                    </Link>
                </div>
            </div>
        </div>
    );
}
