"use client";
import { useEffect, useState } from "react";
import { ordersAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";
import Link from "next/link";

export default function AllOrdersPage() {
    const { token, userData } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            if (!userData?.id) return;
            try {
                const { data } = await ordersAPI.getUserOrders(userData.id);
                setOrders(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        if (token && userData) fetchOrders();
        else setLoading(false);
    }, [token, userData]);

    if (!token) {
        return (
            <div className="orders-page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-icon">🔒</div>
                        <h2>Please login first</h2>
                        <Link href="/login" className="btn-shop-now">Login</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) return <Loading />;

    if (orders.length === 0) {
        return (
            <div className="orders-page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <h2>No orders yet</h2>
                        <p>Start shopping and your orders will appear here</p>
                        <Link href="/products" className="btn-shop-now">Shop Now</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="container">
                <h1>My Orders</h1>
                <p style={{ color: "#6c757d", marginBottom: 24 }}>{orders.length} orders placed</p>

                {orders.map((order) => (
                    <div key={order._id || order.id} className="order-card">
                        <div className="order-header">
                            <span className="order-id">Order #{order.id}</span>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                <span className={`order-status ${order.isDelivered ? "status-delivered" : "status-pending"}`}>
                                    {order.isDelivered ? "Delivered ✓" : "Pending"}
                                </span>
                                <span className={`order-status ${order.isPaid ? "status-delivered" : "status-pending"}`}>
                                    {order.isPaid ? "Paid ✓" : "Unpaid"}
                                </span>
                            </div>
                        </div>

                        <div className="order-items-row">
                            {order.cartItems?.map((item, idx) => (
                                <img
                                    key={idx}
                                    src={item.product?.imageCover}
                                    alt={item.product?.title || "Product"}
                                    className="order-item-thumb"
                                />
                            ))}
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                            <span className="order-total">Total: {order.totalOrderPrice} EGP</span>
                            <span style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                                Payment: {order.paymentMethodType}
                            </span>
                            <span style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                }) : ""}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
