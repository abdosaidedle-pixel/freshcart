"use client";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import { categoriesAPI } from "@/lib/api";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function CategorySlider() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const { data } = await categoriesAPI.getAll();
                setCategories(data.data);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        }
        fetchCategories();
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 2500,
        arrows: true,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 5, slidesToScroll: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 4, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 360, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        ],
    };

    if (categories.length === 0) return null;

    return (
        <section className="category-section">
            <div className="container">
                <h2 className="section-title">Shop Popular Categories</h2>
                <Slider {...settings}>
                    {categories.map((cat) => (
                        <div key={cat._id} className="category-slider-item">
                            <Link href={`/categories/${cat._id}`}>
                                <div className="category-slider-card">
                                    <img src={cat.image} alt={cat.name} />
                                    <h3>{cat.name}</h3>
                                </div>
                            </Link>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
}
