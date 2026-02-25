"use client";
import { useEffect, useState } from "react";
import { brandsAPI } from "@/lib/api";
import Link from "next/link";
import Loading from "@/components/Loading";
import { FiTag } from "react-icons/fi";

export default function BrandsPage() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBrands() {
            try {
                const { data } = await brandsAPI.getAll();
                setBrands(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchBrands();
    }, []);

    return (
        <div className="listing-page">
            <div className="page-header">
                <div className="container">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link> / Brands
                    </div>
                    <div className="page-header-content">
                        <div className="page-header-icon"><FiTag /></div>
                        <div>
                            <h1>Top Brands</h1>
                            <p>Shop from your favorite brands</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ paddingTop: 30 }}>
                {loading ? (
                    <Loading />
                ) : (
                    <div className="brands-grid">
                        {brands.map((brand) => (
                            <Link key={brand._id} href={`/brands/${brand._id}`}>
                                <div className="brand-card">
                                    <img src={brand.image} alt={brand.name} />
                                    <h3>{brand.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
