"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

const slides = [
    {
        bg: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80",
        title: "Fresh Products Delivered\nto your Door",
        subtitle: "Get 20% off your first order",
    },
    {
        bg: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600&q=80",
        title: "Organic Fruits &\nVegetables",
        subtitle: "Farm fresh produce delivered daily",
    },
    {
        bg: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1600&q=80",
        title: "Shop the Best\nBrands Online",
        subtitle: "Electronics, Fashion & More",
    },
];

export default function MainSlider() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: true,
        pauseOnHover: true,
    };

    return (
        <section className="hero-section">
            <Slider {...settings}>
                {slides.map((slide, index) => (
                    <div key={index}>
                        <div
                            className="hero-slide"
                            style={{ backgroundImage: `url(${slide.bg})` }}
                        >
                            <div className="hero-slide-content">
                                <h1>{slide.title}</h1>
                                <p>{slide.subtitle}</p>
                                <div className="hero-buttons">
                                    <Link href="/products" className="hero-btn-primary">Shop Now</Link>
                                    <Link href="/products" className="hero-btn-secondary">View Deals</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </section>
    );
}
