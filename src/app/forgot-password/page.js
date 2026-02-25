"use client";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1);
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const router = useRouter();

    const emailFormik = useFormik({
        initialValues: { email: "" },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email").required("Email is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setApiError("");
            try {
                await authAPI.forgotPassword(values.email);
                setSuccessMsg("Reset code sent to your email!");
                setStep(2);
            } catch (err) {
                setApiError(err.response?.data?.message || "Failed to send reset code");
            } finally {
                setLoading(false);
            }
        },
    });

    const codeFormik = useFormik({
        initialValues: { resetCode: "" },
        validationSchema: Yup.object({
            resetCode: Yup.string().required("Reset code is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setApiError("");
            try {
                await authAPI.verifyResetCode(values.resetCode);
                setSuccessMsg("Code verified!");
                setStep(3);
            } catch (err) {
                setApiError(err.response?.data?.message || "Invalid reset code");
            } finally {
                setLoading(false);
            }
        },
    });

    const passwordFormik = useFormik({
        initialValues: { email: emailFormik.values.email, newPassword: "" },
        enableReinitialize: true,
        validationSchema: Yup.object({
            email: Yup.string().email().required(),
            newPassword: Yup.string().min(6, "At least 6 characters").required("New password is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setApiError("");
            try {
                await authAPI.resetPassword(values);
                setSuccessMsg("Password reset successfully!");
                setTimeout(() => router.push("/login"), 1500);
            } catch (err) {
                setApiError(err.response?.data?.message || "Failed to reset password");
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1>Forgot Password 🔐</h1>
                <p>
                    {step === 1 && "Enter your email to receive a reset code"}
                    {step === 2 && "Enter the reset code sent to your email"}
                    {step === 3 && "Create your new password"}
                </p>

                {apiError && <div className="api-error">{apiError}</div>}
                {successMsg && (
                    <div style={{ background: "#e8f5e8", color: "#0aad0a", padding: "12px 16px", borderRadius: 8, marginBottom: 16, fontSize: "0.85rem", fontWeight: 500, border: "1px solid #0aad0a33" }}>
                        {successMsg}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={emailFormik.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input id="email" name="email" type="email" className={`form-input ${emailFormik.touched.email && emailFormik.errors.email ? "error" : ""}`}
                                placeholder="Enter your email"
                                onChange={emailFormik.handleChange} onBlur={emailFormik.handleBlur} value={emailFormik.values.email}
                            />
                            {emailFormik.touched.email && emailFormik.errors.email && <div className="form-error">{emailFormik.errors.email}</div>}
                        </div>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Code"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={codeFormik.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="resetCode">Reset Code</label>
                            <input id="resetCode" name="resetCode" type="text" className={`form-input ${codeFormik.touched.resetCode && codeFormik.errors.resetCode ? "error" : ""}`}
                                placeholder="Enter reset code"
                                onChange={codeFormik.handleChange} onBlur={codeFormik.handleBlur} value={codeFormik.values.resetCode}
                            />
                            {codeFormik.touched.resetCode && codeFormik.errors.resetCode && <div className="form-error">{codeFormik.errors.resetCode}</div>}
                        </div>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? "Verifying..." : "Verify Code"}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={passwordFormik.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input id="newPassword" name="newPassword" type="password" className={`form-input ${passwordFormik.touched.newPassword && passwordFormik.errors.newPassword ? "error" : ""}`}
                                placeholder="Enter new password"
                                onChange={passwordFormik.handleChange} onBlur={passwordFormik.handleBlur} value={passwordFormik.values.newPassword}
                            />
                            {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && <div className="form-error">{passwordFormik.errors.newPassword}</div>}
                        </div>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}

                <div className="auth-link">
                    Remember your password? <Link href="/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
}
