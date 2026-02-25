"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiPhone, FiMail, FiHeadphones, FiTruck, FiGift, FiMenu, FiX, FiLogOut } from "react-icons/fi";

export default function Navbar() {
    const pathname = usePathname();
    const { token, logout } = useAuth();
    const { cartCount } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const links = [
        { href: "/", label: "Home" },
        { href: "/products", label: "Shop" },
        { href: "/categories", label: "Categories" },
        { href: "/brands", label: "Brands" },
    ];

    return (
        <>
            <div className="top-bar">
                <div className="top-bar-inner">
                    <div className="top-bar-left">
                        <span><FiTruck size={14} /> Free Shipping on Orders 500 EGP</span>
                        <span><FiGift size={14} /> New Arrivals Daily</span>
                    </div>
                    <div className="top-bar-right">
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <FiPhone size={13} /> +1 (800) 123-4567
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <FiMail size={13} /> support@freshcart.com
                        </span>
                        {token ? (
                            <a onClick={logout} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                                <FiLogOut size={13} /> Sign Out
                            </a>
                        ) : (
                            <>
                                <Link href="/login" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                    <FiUser size={13} /> Sign In
                                </Link>
                                <Link href="/register" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                    <FiUser size={13} /> Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <nav className="navbar">
                <div className="navbar-inner">
                    <Link href="/" className="navbar-logo">
                        <span className="logo-icon">🛒</span>
                        <span><span style={{ color: "#16a34a" }}>Fresh</span>Cart</span>
                    </Link>

                    <div className="navbar-search">
                        <input
                            type="text"
                            placeholder="Search for products, brands and more..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button><FiSearch /></button>
                    </div>

                    <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={pathname === link.href ? "active" : ""}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="navbar-support">
                        <div className="support-icon"><FiHeadphones /></div>
                        <div className="support-text">
                            <span>Support</span>
                            <strong>24/7 Help</strong>
                        </div>
                    </div>

                    <div className="navbar-actions">
                        {token && (
                            <>
                                <Link href="/wishlist" className="nav-icon-btn">
                                    <FiHeart />
                                </Link>
                                <Link href="/cart" className="nav-icon-btn">
                                    <FiShoppingCart />
                                    {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
                                </Link>
                                <Link href="/allorders" className="nav-icon-btn">
                                    <FiUser />
                                </Link>
                            </>
                        )}

                        {token ? (
                            <button onClick={logout} className="btn-signout">Sign Out</button>
                        ) : (
                            <Link href="/login" className="btn-signin">
                                <FiUser size={16} />
                                Sign In
                            </Link>
                        )}
                    </div>

                    <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                    </button>
                </div>
            </nav>
        </>
    );
}
