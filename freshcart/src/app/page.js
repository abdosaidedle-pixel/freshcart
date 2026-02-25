"use client";
import { useEffect, useState } from "react";
import { productsAPI, categoriesAPI } from "@/lib/api";
import MainSlider from "@/components/MainSlider";
import ProductCard from "@/components/ProductCard";
import Loading from "@/components/Loading";
import Link from "next/link";
import { FiTruck, FiShield, FiRefreshCw, FiHeadphones, FiArrowRight } from "react-icons/fi";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsAPI.getAll({ limit: 20 }),
          categoriesAPI.getAll(),
        ]);
        setProducts(productsRes.data.data);
        setCategories(categoriesRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <MainSlider />

      <div className="features-bar">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon blue"><FiTruck size={22} /></div>
              <div className="feature-text">
                <h4>Free Shipping</h4>
                <p>On orders over 500 EGP</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon green"><FiShield size={22} /></div>
              <div className="feature-text">
                <h4>Secure Payment</h4>
                <p>100% secure transactions</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon orange"><FiRefreshCw size={22} /></div>
              <div className="feature-text">
                <h4>Easy Returns</h4>
                <p>14-day return policy</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon teal"><FiHeadphones size={22} /></div>
              <div className="feature-text">
                <h4>24/7 Support</h4>
                <p>Dedicated support team</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop By <span className="highlight">Category</span></h2>
            <Link href="/categories" className="section-link">
              View All Categories <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <div className="categories-grid-home">
              {categories.map((cat) => (
                <Link key={cat._id} href={`/categories/${cat._id}`}>
                  <div className="category-home-card">
                    <img src={cat.image} alt={cat.name} className="category-home-img" />
                    <h3>{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="promo-section">
        <div className="container">
          <div className="promo-grid">
            <div className="promo-card green">
              <div className="promo-badge">🔥 Deal of the Day</div>
              <h2>Fresh Organic Fruits</h2>
              <p>Get up to 40% off on selected organic fruits</p>
              <div className="promo-discount">
                40% OFF <span>Use code: <strong>ORGANIC40</strong></span>
              </div>
              <Link href="/products" className="promo-btn">
                Shop Now <FiArrowRight />
              </Link>
            </div>
            <div className="promo-card orange">
              <div className="promo-badge">✨ New Arrivals</div>
              <h2>Exotic Vegetables</h2>
              <p>Discover our latest collection of premium vegetables</p>
              <div className="promo-discount">
                25% OFF <span>Use code: <strong>FRESH25</strong></span>
              </div>
              <Link href="/products" className="promo-btn">
                Explore Now <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured <span className="highlight">Products</span></h2>
            <Link href="/products" className="section-link">
              View All Products <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
