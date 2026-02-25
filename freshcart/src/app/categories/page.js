"use client";
import { useEffect, useState } from "react";
import { categoriesAPI } from "@/lib/api";
import Link from "next/link";
import Loading from "@/components/Loading";

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const { data } = await categoriesAPI.getAll();
                setCategories(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="listing-page">
            <div className="container">
                <h1>All Categories</h1>
                <div className="categories-grid">
                    {categories.map((cat) => (
                        <Link key={cat._id} href={`/categories/${cat._id}`}>
                            <div className="category-card-item">
                                <img src={cat.image} alt={cat.name} />
                                <h3>{cat.name}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
