import axios from "axios";

const BASE_URL = "https://ecommerce.routemisr.com";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.token = token;
    }
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post("/api/v1/auth/signup", data),
  login: (data) => api.post("/api/v1/auth/signin", data),
  forgotPassword: (email) =>
    api.post("/api/v1/auth/forgotPasswords", { email }),
  verifyResetCode: (resetCode) =>
    api.post("/api/v1/auth/verifyResetCode", { resetCode }),
  resetPassword: (data) => api.put("/api/v1/auth/resetPassword", data),
};

export const productsAPI = {
  getAll: (params) => api.get("/api/v1/products", { params }),
  getById: (id) => api.get(`/api/v1/products/${id}`),
};

export const categoriesAPI = {
  getAll: () => api.get("/api/v1/categories"),
  getById: (id) => api.get(`/api/v1/categories/${id}`),
  getSubcategories: (id) =>
    api.get(`/api/v1/categories/${id}/subcategories`),
};

export const brandsAPI = {
  getAll: () => api.get("/api/v1/brands"),
  getById: (id) => api.get(`/api/v1/brands/${id}`),
};

export const cartAPI = {
  getCart: () => api.get("/api/v1/cart"),
  addToCart: (productId) =>
    api.post("/api/v1/cart", { productId }),
  updateQuantity: (productId, count) =>
    api.put(`/api/v1/cart/${productId}`, { count }),
  removeItem: (productId) => api.delete(`/api/v1/cart/${productId}`),
  clearCart: () => api.delete("/api/v1/cart"),
};

export const wishlistAPI = {
  getWishlist: () => api.get("/api/v1/wishlist"),
  addToWishlist: (productId) =>
    api.post("/api/v1/wishlist", { productId }),
  removeFromWishlist: (productId) =>
    api.delete(`/api/v1/wishlist/${productId}`),
};

export const ordersAPI = {
  createCashOrder: (cartId, shippingAddress) =>
    api.post(`/api/v1/orders/${cartId}`, { shippingAddress }),
  createOnlineOrder: (cartId, shippingAddress) =>
    api.post(
      `/api/v1/orders/checkout-session/${cartId}?url=${typeof window !== "undefined" ? window.location.origin : ""}`,
      { shippingAddress }
    ),
  getUserOrders: (userId) => api.get(`/api/v1/orders/user/${userId}`),
};

export default api;
