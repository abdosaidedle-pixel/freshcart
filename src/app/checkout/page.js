"use client";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ordersAPI } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CheckoutPage() {
    const { token } = useAuth();
    const { cart, getCart } = useCart();
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            details: "",
            phone: "",
            city: "",
        },
        validationSchema: Yup.object({
            details: Yup.string().required("Address details are required"),
            phone: Yup.string().required("Phone is required"),
            city: Yup.string().required("City is required"),
        }),
        onSubmit: async (values) => {
            if (!cart?._id) {
                toast.error("No cart found");
                return;
            }
            setLoading(true);
            try {
                if (paymentMethod === "cash") {
                    await ordersAPI.createCashOrder(cart._id, values);
                    toast.success("Order placed successfully! 🎉");
                    await getCart();
                    router.push("/allorders");
                } else {
                    const { data } = await ordersAPI.createOnlineOrder(cart._id, values);
                    if (data.session?.url) {
                        window.location.href = data.session.url;
                    } else {
                        toast.error("Failed to create payment session");
                    }
                }
            } catch (err) {
                toast.error(err.response?.data?.message || "Checkout failed");
            } finally {
                setLoading(false);
            }
        },
    });

    if (!token) {
        return (
            <div className="checkout-page">
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

    if (!cart || !cart.products || cart.products.length === 0) {
        return (
            <div className="checkout-page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Add items to your cart before checkout</p>
                        <Link href="/products" className="btn-shop-now">Shop Now</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <h1>Checkout</h1>

                <div className="checkout-form">
                    <div className="payment-toggle">
                        <button
                            type="button"
                            className={`payment-option ${paymentMethod === "cash" ? "active" : ""}`}
                            onClick={() => setPaymentMethod("cash")}
                        >
                            💵 Cash on Delivery
                        </button>
                        <button
                            type="button"
                            className={`payment-option ${paymentMethod === "online" ? "active" : ""}`}
                            onClick={() => setPaymentMethod("online")}
                        >
                            💳 Online Payment
                        </button>
                    </div>

                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="details">Address Details</label>
                            <input id="details" name="details" type="text"
                                className={`form-input ${formik.touched.details && formik.errors.details ? "error" : ""}`}
                                placeholder="Street, Building, Apartment"
                                onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.details}
                            />
                            {formik.touched.details && formik.errors.details && <div className="form-error">{formik.errors.details}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input id="phone" name="phone" type="tel"
                                className={`form-input ${formik.touched.phone && formik.errors.phone ? "error" : ""}`}
                                placeholder="01xxxxxxxxx"
                                onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.phone}
                            />
                            {formik.touched.phone && formik.errors.phone && <div className="form-error">{formik.errors.phone}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <input id="city" name="city" type="text"
                                className={`form-input ${formik.touched.city && formik.errors.city ? "error" : ""}`}
                                placeholder="Cairo, Alexandria, etc."
                                onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.city}
                            />
                            {formik.touched.city && formik.errors.city && <div className="form-error">{formik.errors.city}</div>}
                        </div>

                        <div style={{ background: "#f8f9fa", padding: 16, borderRadius: 10, marginBottom: 20 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                <span style={{ color: "#6c757d" }}>Items:</span>
                                <span style={{ fontWeight: 600 }}>{cart.products.length}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#6c757d" }}>Total:</span>
                                <span style={{ fontWeight: 800, color: "#0aad0a", fontSize: "1.2rem" }}>{cart.totalCartPrice} EGP</span>
                            </div>
                        </div>

                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading
                                ? "Processing..."
                                : paymentMethod === "cash"
                                    ? "Place Order (Cash)"
                                    : "Pay Online"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
