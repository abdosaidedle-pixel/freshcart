"use client";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiTruck, FiShield, FiClock } from "react-icons/fi";
import { FaGoogle, FaFacebook } from "react-icons/fa";

export default function RegisterPage() {
    const { login, token } = useAuth();
    const router = useRouter();
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showRePass, setShowRePass] = useState(false);

    useEffect(() => {
        if (token) {
            router.push("/");
        }
    }, [token, router]);

    const formik = useFormik({
        initialValues: { name: "", email: "", phone: "", password: "", rePassword: "" },
        validationSchema: Yup.object({
            name: Yup.string().min(3, "Name must be at least 3 characters").max(30, "Name is too long").required("Full name is required"),
            email: Yup.string().email("Please enter a valid email").required("Email is required"),
            phone: Yup.string().matches(/^01[0125][0-9]{8}$/, "Please enter a valid Egyptian phone number").required("Phone number is required"),
            password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
            rePassword: Yup.string().oneOf([Yup.ref("password")], "Passwords do not match").required("Please confirm your password"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setApiError("");
            try {
                const { data } = await authAPI.register(values);
                localStorage.setItem("savedEmail", values.email);
                login(data.token, true);
                toast.success("Account created successfully! 🎉");
                router.push("/");
            } catch (err) {
                const isNetworkError = !err.response || err.code === "ERR_NETWORK" || err.code === "ECONNABORTED" || err.message?.includes("Network Error") || err.message?.includes("timeout");

                if (isNetworkError) {
                    setApiError("SERVER_DOWN");
                    toast.error("Server is currently unavailable");
                } else {
                    const msg = err.response?.data?.message || "Registration failed. Please try again.";
                    const isAccountExists = msg.toLowerCase().includes("account already") ||
                        msg.includes("الحساب موجود") ||
                        msg.toLowerCase().includes("already registered");
                    if (isAccountExists) {
                        setApiError("ACCOUNT_EXISTS");
                        localStorage.setItem("savedEmail", values.email);
                    } else {
                        setApiError(msg);
                    }
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
                    <h2>Join FreshCart Today</h2>
                    <p>Get access to exclusive deals and personalized recommendations</p>
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
                    <h1>Welcome to FreshCart</h1>
                    <p className="auth-desc">Create your account and start shopping</p>

                    <div className="social-login">
                        <button className="social-btn" type="button"><FaGoogle size={18} color="#db4437" /> Continue with Google</button>
                        <button className="social-btn" type="button"><FaFacebook size={18} color="#4267B2" /> Continue with Facebook</button>
                    </div>

                    <div className="divider"><span>or continue with email</span></div>

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
                    ) : apiError && apiError === "ACCOUNT_EXISTS" ? (
                        <div className="api-error account-exists-error">
                            <strong>This email is already registered!</strong>
                            <p style={{ margin: "6px 0 0", fontSize: "13px", lineHeight: "1.5" }}>
                                You already have an account with this email.{" "}
                                <Link href="/login" style={{ color: "#16a34a", fontWeight: 600, textDecoration: "underline" }}>Sign in here</Link>{" "}
                                or{" "}
                                <Link href="/forgot-password" style={{ color: "#16a34a", fontWeight: 600, textDecoration: "underline" }}>reset your password</Link>.
                            </p>
                        </div>
                    ) : apiError ? (
                        <div className="api-error">{apiError}</div>
                    ) : null}

                    <form onSubmit={formik.handleSubmit} autoComplete="on">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <div className="form-input-wrapper">
                                <FiUser className="input-icon" />
                                <input id="name" name="name" type="text" autoComplete="name"
                                    className={`form-input ${formik.touched.name && formik.errors.name ? "error" : ""}`}
                                    placeholder="Enter your full name"
                                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name}
                                />
                            </div>
                            {formik.touched.name && formik.errors.name && <div className="form-error">{formik.errors.name}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="form-input-wrapper">
                                <FiMail className="input-icon" />
                                <input id="email" name="email" type="email" autoComplete="email"
                                    className={`form-input ${formik.touched.email && formik.errors.email ? "error" : ""}`}
                                    placeholder="Enter your email"
                                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email}
                                />
                            </div>
                            {formik.touched.email && formik.errors.email && <div className="form-error">{formik.errors.email}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <div className="form-input-wrapper">
                                <FiPhone className="input-icon" />
                                <input id="phone" name="phone" type="tel" autoComplete="tel"
                                    className={`form-input ${formik.touched.phone && formik.errors.phone ? "error" : ""}`}
                                    placeholder="01xxxxxxxxx"
                                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.phone}
                                />
                            </div>
                            {formik.touched.phone && formik.errors.phone && <div className="form-error">{formik.errors.phone}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="form-input-wrapper">
                                <FiLock className="input-icon" />
                                <input id="password" name="password"
                                    type={showPass ? "text" : "password"} autoComplete="new-password"
                                    className={`form-input ${formik.touched.password && formik.errors.password ? "error" : ""}`}
                                    placeholder="Create a password (min 6 chars)"
                                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password}
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="toggle-pass-btn" aria-label="Toggle password visibility">
                                    {showPass ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {formik.touched.password && formik.errors.password && <div className="form-error">{formik.errors.password}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="rePassword">Confirm Password</label>
                            <div className="form-input-wrapper">
                                <FiLock className="input-icon" />
                                <input id="rePassword" name="rePassword"
                                    type={showRePass ? "text" : "password"} autoComplete="new-password"
                                    className={`form-input ${formik.touched.rePassword && formik.errors.rePassword ? "error" : ""}`}
                                    placeholder="Re-enter your password"
                                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.rePassword}
                                />
                                <button type="button" onClick={() => setShowRePass(!showRePass)}
                                    className="toggle-pass-btn" aria-label="Toggle password visibility">
                                    {showRePass ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {formik.touched.rePassword && formik.errors.rePassword && <div className="form-error">{formik.errors.rePassword}</div>}
                        </div>

                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? (
                                <span className="btn-loading">
                                    <span className="btn-spinner"></span>
                                    Creating Account...
                                </span>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <div className="auth-link">
                        Already have an account? <Link href="/login">Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
