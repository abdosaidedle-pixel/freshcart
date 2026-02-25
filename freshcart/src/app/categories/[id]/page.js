"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { categoriesAPI, productsAPI } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Loading from "@/components/Loading";

export default function CategoryDetailsPage() {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [catRes, productsRes, subRes] = await Promise.all([
                    categoriesAPI.getById(id),
                    productsAPI.getAll({ "category[in]": id }),
                    categoriesAPI.getSubcategories(id).catch(() => ({ data: { data: [] } })),
                ]);
                setCategory(catRes.data.data);
                setProducts(productsRes.data.data);
                setSubcategories(subRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchData();
    }, [id]);

    if (loading) return <Loading />;

    return (
        <div className="listing-page">
            <div className="container">
                {category && (
                    <div style={{ textAlign: "center", marginBottom: 30 }}>
                        <img
                            src={category.image}
                            alt={category.name}
                            style={{ width: 200, height: 200, objectFit: "cover", borderRadius: 16, margin: "0 auto 16px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}
                        />
                        <h1>{category.name}</h1>
                    </div>
                )}

                {subcategories.length > 0 && (
                    <div style={{ marginBottom: 30 }}>
                        <h2 className="section-title">Subcategories</h2>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                            {subcategories.map((sub) => (
                                <span
                                    key={sub._id}
                                    style={{
                                        padding: "8px 18px",
                                        background: "#e8f5e8",
                                        color: "#0aad0a",
                                        borderRadius: 20,
                                        fontSize: "0.85rem",
                                        fontWeight: 600,
                                    }}
                                >
                                    {sub.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <h2 className="section-title">Products</h2>
                {products.length > 0 ? (
                    <div className="products-grid">
                        {products.map((product) => (
                            <ProductCard key={product._id || product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <h2>No products in this category</h2>
                    </div>
                )}
            </div>
        </div>
    );
}
