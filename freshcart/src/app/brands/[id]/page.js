"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { brandsAPI, productsAPI } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Loading from "@/components/Loading";

export default function BrandDetailsPage() {
    const { id } = useParams();
    const [brand, setBrand] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [brandRes, productsRes] = await Promise.all([
                    brandsAPI.getById(id),
                    productsAPI.getAll({ "brand": id }),
                ]);
                setBrand(brandRes.data.data);
                setProducts(productsRes.data.data);
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
                {brand && (
                    <div style={{ textAlign: "center", marginBottom: 30 }}>
                        <img
                            src={brand.image}
                            alt={brand.name}
                            style={{ width: 160, height: 160, objectFit: "contain", margin: "0 auto 16px", background: "#f8f9fa", borderRadius: 16, padding: 16, boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}
                        />
                        <h1>{brand.name}</h1>
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
                        <h2>No products for this brand</h2>
                    </div>
                )}
            </div>
        </div>
    );
}
