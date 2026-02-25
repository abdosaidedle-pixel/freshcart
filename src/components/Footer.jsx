"use client";
import Link from "next/link";
import { FiPhone, FiMail, FiMapPin, FiTruck, FiShield, FiRefreshCw, FiHeadphones } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaCreditCard } from "react-icons/fa";

export default function Footer() {
    return (
        <>
            <div className="footer-features">
                <div className="footer-features-grid">
                    <div className="feature-item">
                        <div className="feature-icon blue"><FiTruck /></div>
                        <div className="feature-text">
                            <h4>Free Shipping</h4>
                            <p>On orders over 500 EGP</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon orange"><FiRefreshCw /></div>
                        <div className="feature-text">
                            <h4>Easy Returns</h4>
                            <p>14-day return policy</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon green"><FiShield /></div>
                        <div className="feature-text">
                            <h4>Secure Payment</h4>
                            <p>100% secure checkout</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon teal"><FiHeadphones /></div>
                        <div className="feature-text">
                            <h4>24/7 Support</h4>
                            <p>Contact us anytime</p>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="footer">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <span className="logo-icon">🛒</span>
                            <span><span style={{ color: "#22c55e" }}>Fresh</span>Cart</span>
                        </div>
                        <p>
                            FreshCart is your one-stop destination for quality products.
                            From fashion to electronics, we bring you the best brands
                            at competitive prices with a seamless shopping experience.
                        </p>
                        <div className="footer-contact">
                            <span><FiPhone size={14} /> +1 (800) 123-4567</span>
                            <span><FiMail size={14} /> support@freshcart.com</span>
                            <span><FiMapPin size={14} /> 123 Commerce Street, New York, NY 10001</span>
                        </div>
                        <div className="footer-social">
                            <a href="#"><FaFacebookF /></a>
                            <a href="#"><FaTwitter /></a>
                            <a href="#"><FaInstagram /></a>
                            <a href="#"><FaYoutube /></a>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h3>Shop</h3>
                        <Link href="/products">All Products</Link>
                        <Link href="/categories">Categories</Link>
                        <Link href="/brands">Brands</Link>
                        <Link href="/categories">Electronics</Link>
                        <Link href="/categories">Men&apos;s Fashion</Link>
                        <Link href="/categories">Women&apos;s Fashion</Link>
                    </div>

                    <div className="footer-column">
                        <h3>Account</h3>
                        <Link href="/login">My Account</Link>
                        <Link href="/allorders">Order History</Link>
                        <Link href="/wishlist">Wishlist</Link>
                        <Link href="/cart">Shopping Cart</Link>
                        <Link href="/login">Sign In</Link>
                        <Link href="/register">Create Account</Link>
                    </div>

                    <div className="footer-column">
                        <h3>Support</h3>
                        <a href="#">Contact Us</a>
                        <a href="#">Help Center</a>
                        <a href="#">Shipping Info</a>
                        <a href="#">Returns & Refunds</a>
                        <a href="#">Track Order</a>
                    </div>

                    <div className="footer-column">
                        <h3>Legal</h3>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Cookie Policy</a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-bottom-inner">
                        <span>© 2026 FreshCart. All rights reserved.</span>
                        <div className="footer-payments">
                            <span><FaCreditCard /> Visa</span>
                            <span><FaCreditCard /> Mastercard</span>
                            <span><FaCreditCard /> PayPal</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
