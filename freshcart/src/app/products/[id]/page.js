"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { productsAPI } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { FaStar, FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import ProductCard from "@/components/ProductCard";
import Loading from "@/components/Loading";

export default function ProductDetailsPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState("");
    const [addingToCart, setAddingToCart] = useState(false);
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    useEffect(() => {
        async function fetchProduct() {
            setLoading(true);
            try {
                const { data } = await productsAPI.getById(id);
                setProduct(data.data);
                setMainImage(data.data.imageCover);

                if (data.data.category?._id) {
                    const relatedRes = await productsAPI.getAll({
                        "category[in]": data.data.category._id,
                        limit: 8,
                    });
                    setRelated(
                        relatedRes.data.data.filter(
                            (p) => (p._id || p.id) !== (data.data._id || data.data.id)
                        )
                    );
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchProduct();
    }, [id]);

    async function handleAddToCart() {
        setAddingToCart(true);
        await addToCart(product._id || product.id);
        setAddingToCart(false);
    }

    if (loading) return <Loading />;
    if (!product)
        return (
            <div className="empty-state">
                <h2>Product not found</h2>
            </div>
        );

    const wishlisted = isInWishlist(product._id || product.id);

    return (
        <div className="product-details">
            <div className="container">
                <div className="product-details-grid">
                    <div className="product-details-images">
                        <img src={mainImage} alt={product.title} className="product-main-image" />
                        {product.images && product.images.length > 0 && (
                            <div className="product-thumbnails">
                                <img
                                    src={product.imageCover}
                                    alt="cover"
                                    className={`product-thumb ${mainImage === product.imageCover ? "active" : ""}`}
                                    onClick={() => setMainImage(product.imageCover)}
                                />
                                {product.images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`${product.title} ${idx}`}
                                        className={`product-thumb ${mainImage === img ? "active" : ""}`}
                                        onClick={() => setMainImage(img)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="product-details-info">
                        <span className="product-details-category">
                            {product.category?.name} / {product.subcategory?.[0]?.name || product.brand?.name}
                        </span>
                        <h1>{product.title}</h1>
                        <p className="product-details-desc">{product.description}</p>

                        <div className="product-details-meta">
                            <span className="product-details-price">{product.price} EGP</span>
                            <span className="product-details-rating">
                                <FaStar />
                                <span>{product.ratingsAverage} ({product.ratingsQuantity} reviews)</span>
                            </span>
                        </div>

                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <button
                                className="btn-add-cart"
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                                style={{ flex: 1 }}
                            >
                                {addingToCart ? "Adding..." : "🛒 Add to Cart"}
                            </button>
                            <button
                                className="product-wishlist-btn"
                                onClick={() => toggleWishlist(product._id || product.id)}
                                style={{
                                    position: "static",
                                    width: 50,
                                    height: 50,
                                    fontSize: "1.3rem",
                                    border: "2px solid #dee2e6",
                                }}
                            >
                                {wishlisted ? <FaHeart color="#dc3545" /> : <FiHeart />}
                            </button>
                        </div>

                        <div style={{ fontSize: "0.85rem", color: "#6c757d", marginTop: 8 }}>
                            <p>Brand: <strong>{product.brand?.name || "N/A"}</strong></p>
                            <p>Sold: <strong>{product.sold}</strong> items</p>
                            <p>Stock: <strong style={{ color: product.quantity > 0 ? "#0aad0a" : "#dc3545" }}>
                                {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                            </strong></p>
                        </div>
                    </div>
                </div>

                {related.length > 0 && (
                    <div style={{ marginTop: 50 }}>
                        <h2 className="section-title">Related Products</h2>
                        <div className="products-grid">
                            {related.slice(0, 4).map((p) => (
                                <ProductCard key={p._id || p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
