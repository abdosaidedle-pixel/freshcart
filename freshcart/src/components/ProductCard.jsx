"use client";
import Link from "next/link";
import { FiHeart, FiRefreshCw, FiEye, FiPlus } from "react-icons/fi";
import { FaHeart, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useState } from "react";

function StarRating({ rating }) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars.push(<FaStar key={i} />);
        } else if (rating >= i - 0.5) {
            stars.push(<FaStarHalfAlt key={i} />);
        } else {
            stars.push(<FaRegStar key={i} />);
        }
    }
    return <div className="stars">{stars}</div>;
}

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const [adding, setAdding] = useState(false);

    const id = product._id || product.id;
    const wishlisted = isInWishlist(id);
    const discount = product.priceAfterDiscount
        ? Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)
        : null;

    async function handleAddToCart(e) {
        e.preventDefault();
        e.stopPropagation();
        setAdding(true);
        await addToCart(id);
        setAdding(false);
    }

    return (
        <Link href={`/products/${id}`} className="product-card">
            <div className="product-card-img">
                <img src={product.imageCover} alt={product.title} />

                {discount && (
                    <span className="product-discount">-{discount}%</span>
                )}

                <div className="product-actions-overlay">
                    <button
                        className={`product-action-btn ${wishlisted ? "active" : ""}`}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(id); }}
                    >
                        {wishlisted ? <FaHeart /> : <FiHeart />}
                    </button>
                    <button className="product-action-btn" onClick={(e) => e.preventDefault()}>
                        <FiRefreshCw size={14} />
                    </button>
                    <button className="product-action-btn" onClick={(e) => e.preventDefault()}>
                        <FiEye size={14} />
                    </button>
                </div>
            </div>

            <div className="product-card-body">
                <span className="product-card-category">{product.category?.name}</span>
                <h3 className="product-card-title">{product.title}</h3>
                <div className="product-card-rating">
                    <StarRating rating={product.ratingsAverage || 0} />
                    <span>{product.ratingsAverage} ({product.ratingsQuantity || 0})</span>
                </div>
                <div className="product-card-bottom">
                    <div className="product-price-group">
                        <span className="product-price">
                            {product.priceAfterDiscount || product.price} EGP
                        </span>
                        {product.priceAfterDiscount && (
                            <span className="product-old-price">{product.price} EGP</span>
                        )}
                    </div>
                    <button
                        className="product-add-btn"
                        onClick={handleAddToCart}
                        disabled={adding}
                    >
                        <FiPlus />
                    </button>
                </div>
            </div>
        </Link>
    );
}
