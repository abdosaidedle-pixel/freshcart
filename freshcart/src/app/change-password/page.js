"use client";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ChangePasswordPage() {
    const { token, logout } = useAuth();
    const router = useRouter();
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            currentPassword: "",
            password: "",
            rePassword: "",
        },
        validationSchema: Yup.object({
            currentPassword: Yup.string().required("Current password is required"),
            password: Yup.string().min(6, "At least 6 characters").required("New password is required"),
            rePassword: Yup.string().oneOf([Yup.ref("password")], "Passwords must match").required("Confirm new password"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setApiError("");
            try {
                await axios.put(
                    "https://ecommerce.routemisr.com/api/v1/users/changeMyPassword",
                    values,
                    { headers: { token } }
                );
                toast.success("Password changed! Please login again.");
                logout();
                router.push("/login");
            } catch (err) {
                setApiError(err.response?.data?.message || err.response?.data?.errors?.msg || "Failed to change password");
            } finally {
                setLoading(false);
            }
        },
    });

    if (!token) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="empty-state">
                        <div className="empty-icon">🔒</div>
                        <h2>Please login first</h2>
                        <Link href="/login" className="btn-shop-now">Login</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1>Change Password 🔑</h1>
                <p>Update your account password</p>

                {apiError && <div className="api-error">{apiError}</div>}

                <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <input id="currentPassword" name="currentPassword" type="password"
                            className={`form-input ${formik.touched.currentPassword && formik.errors.currentPassword ? "error" : ""}`}
                            placeholder="Enter current password"
                            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.currentPassword}
                        />
                        {formik.touched.currentPassword && formik.errors.currentPassword && <div className="form-error">{formik.errors.currentPassword}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input id="password" name="password" type="password"
                            className={`form-input ${formik.touched.password && formik.errors.password ? "error" : ""}`}
                            placeholder="Enter new password"
                            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password && <div className="form-error">{formik.errors.password}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="rePassword">Confirm New Password</label>
                        <input id="rePassword" name="rePassword" type="password"
                            className={`form-input ${formik.touched.rePassword && formik.errors.rePassword ? "error" : ""}`}
                            placeholder="Confirm new password"
                            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.rePassword}
                        />
                        {formik.touched.rePassword && formik.errors.rePassword && <div className="form-error">{formik.errors.rePassword}</div>}
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? "Updating..." : "Change Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
