"use client";
import { useEffect, useState } from "react";
import { productsAPI } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Loading from "@/components/Loading";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchProducts() {
            try {
                const { data } = await productsAPI.getAll({ limit: 40 });
                setProducts(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    const filteredProducts = products.filter((p) =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="listing-page">
            <div className="container">
                <h1>All Products</h1>

                <div style={{ marginBottom: 24 }}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="🔍 Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ maxWidth: 400 }}
                    />
                </div>

                {loading ? (
                    <Loading />
                ) : (
                    <div className="products-grid">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <ProductCard key={product._id || product.id} product={product} />
                            ))
                        ) : (
                            <div className="empty-state">
                                <h2>No products found</h2>
                                <p>Try a different search term</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
