"use client";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff, FiTruck, FiShield, FiClock, FiCheck } from "react-icons/fi";
import { FaGoogle, FaFacebook } from "react-icons/fa";

export default function LoginPage() {
    const { login, token } = useAuth();
    const router = useRouter();
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [savedEmail, setSavedEmail] = useState("");

    useEffect(() => {
        if (token) {
            router.push("/");
        }
    }, [token, router]);

    useEffect(() => {
        const email = localStorage.getItem("savedEmail");
        if (email) {
            setSavedEmail(email);
        }
    }, []);

    const formik = useFormik({
        initialValues: { email: savedEmail || "", password: "" },
        enableReinitialize: true,
        validationSchema: Yup.object({
            email: Yup.string().email("Please enter a valid email").required("Email is required"),
            password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setApiError("");
            try {
                const { data } = await authAPI.login(values);

                if (rememberMe) {
                    localStorage.setItem("savedEmail", values.email);
                } else {
                    localStorage.removeItem("savedEmail");
                }

                login(data.token, rememberMe);
                toast.success(`Welcome back! 👋`);
                router.push("/");
            } catch (err) {
                const isNetworkError = !err.response || err.code === "ERR_NETWORK" || err.code === "ECONNABORTED" || err.message?.includes("Network Error") || err.message?.includes("timeout");

                if (isNetworkError) {
                    setApiError("SERVER_DOWN");
                    toast.error("Server is currently unavailable");
                } else {
                    const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
                    setApiError(msg);
                }
                const form = document.querySelector(".auth-right");
                if (form) {
                    form.style.animation = "shake 0.4s ease";
                    setTimeout(() => { form.style.animation = ""; }, 400);
                }
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="auth-page">
            <div className="auth-wrapper">
                <div className="auth-left">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/4290/4290854.png"
                        alt="Shopping Cart"
                    />
                    <h2>FreshCart - Your One-Stop Shop for Fresh Products</h2>
                    <p>Join thousands of happy customers who trust FreshCart for their daily grocery needs</p>
                    <div className="auth-features">
                        <span><FiTruck size={16} color="#16a34a" /> Free Delivery</span>
                        <span><FiShield size={16} color="#16a34a" /> Secure Payment</span>
                        <span><FiClock size={16} color="#16a34a" /> 24/7 Support</span>
                    </div>
                </div>

                <div className="auth-right">
                    <div className="auth-brand">
                        <span className="highlight">Fresh</span>Cart
                    </div>
                    <h1>Welcome Back!</h1>
                    <p className="auth-desc">Sign in to continue your fresh shopping experience</p>

                    <div className="social-login">
                        <button className="social-btn" type="button">
                            <FaGoogle size={18} color="#db4437" />
                            Continue with Google
                        </button>
                        <button className="social-btn" type="button">
                            <FaFacebook size={18} color="#4267B2" />
                            Continue with Facebook
                        </button>
                    </div>

                    <div className="divider">
                        <span>or continue with email</span>
                    </div>

                    {apiError && apiError === "SERVER_DOWN" ? (
                        <div className="api-error" style={{ background: "#fef3c7", borderColor: "#f59e0b", color: "#92400e" }}>
                            <strong>⚠️ Server Unavailable</strong>
                            <p style={{ margin: "6px 0 0", fontSize: "13px", lineHeight: "1.5" }}>
                                The server is currently down or unreachable. This is not your fault — please try again in a few minutes.
                            </p>
                            <button type="button" onClick={() => formik.handleSubmit()}
                                style={{ marginTop: "8px", padding: "6px 16px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
                                🔄 Try Again
                            </button>
                        </div>
                    ) : apiError ? (
                        <div className="api-error">{apiError}</div>
                    ) : null}

                    <form onSubmit={formik.handleSubmit} autoComplete="on">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="form-input-wrapper">
                                <FiMail className="input-icon" />
                                <input
                                    id="email" name="email" type="email"
                                    autoComplete="email"
                                    className={`form-input ${formik.touched.email && formik.errors.email ? "error" : ""}`}
                                    placeholder="Enter your email"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                />
                            </div>
                            {formik.touched.email && formik.errors.email && (
                                <div className="form-error">{formik.errors.email}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <div className="form-row">
                                <label htmlFor="password">Password</label>
                                <Link href="/forgot-password">Forgot Password?</Link>
                            </div>
                            <div className="form-input-wrapper">
                                <FiLock className="input-icon" />
                                <input
                                    id="password" name="password"
                                    type={showPass ? "text" : "password"}
                                    autoComplete="current-password"
                                    className={`form-input ${formik.touched.password && formik.errors.password ? "error" : ""}`}
                                    placeholder="Enter your password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="toggle-pass-btn"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPass ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {formik.touched.password && formik.errors.password && (
                                <div className="form-error">{formik.errors.password}</div>
                            )}
                        </div>

                        <div className="remember-row">
                            <label className="checkbox-label" onClick={() => setRememberMe(!rememberMe)}>
                                <span className={`custom-checkbox ${rememberMe ? "checked" : ""}`}>
                                    {rememberMe && <FiCheck size={12} />}
                                </span>
                                Keep me signed in
                            </label>
                        </div>

                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? (
                                <span className="btn-loading">
                                    <span className="btn-spinner"></span>
                                    Signing in...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <div className="auth-link">
                        New to FreshCart? <Link href="/register">Create an account</Link>
                    </div>

                    <div className="auth-trust">
                        <span>🔒 SSL Secured</span>
                        <span>👥 50K+ Users</span>
                        <span>⭐ 4.9 Rating</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
