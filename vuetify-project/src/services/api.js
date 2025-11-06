import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.config.url, response.data)
    return response
  },
  error => {
    console.error('API Error:', error.config?.url, error.response?.data)
    return Promise.reject(error)
  },
)

// Generate or get session ID
function getSessionId () {
  let sessionId = localStorage.getItem('sessionId')
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).slice(2, 11) + Date.now()
    localStorage.setItem('sessionId', sessionId)
  }
  return sessionId
}

// Restaurants API
export const restaurantAPI = {
  getAll: params => api.get('/restaurants', { params }),
  getById: id => api.get(`/restaurants/${id}`),
  create: data => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  delete: id => api.delete(`/restaurants/${id}`),
}

// Products API
export const productAPI = {
  getAll: params => api.get('/products', { params }),
  getById: id => api.get(`/products/${id}`),
  getByRestaurant: restaurantId => api.get('/products', { params: { restaurant: restaurantId } }),
  create: data => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: id => api.delete(`/products/${id}`),
}

// Cart API
export const cartAPI = {
  get: () => api.get('/cart', { params: { sessionId: getSessionId() } }),
  addItem: (productId, quantity, price, restaurantId) =>
    api.post('/cart', {
      sessionId: getSessionId(),
      productId,
      quantity,
      price,
      restaurantId,
    }),
  updateItem: (productId, quantity) =>
    api.put('/cart', {
      sessionId: getSessionId(),
      productId,
      quantity,
    }),
  removeItem: productId =>
    api.delete(`/cart/${productId}`, {
      params: { sessionId: getSessionId() },
    }),
  clear: () => api.delete('/cart', { params: { sessionId: getSessionId() } }),
}

// Orders API
export const orderAPI = {
  getAll: () => api.get('/orders', { params: { sessionId: getSessionId() } }),
  getById: id => api.get(`/orders/${id}`),
  create: (deliveryAddress, paymentMethod) =>
    api.post('/orders', {
      sessionId: getSessionId(),
      deliveryAddress,
      paymentMethod,
    }),
  updateStatus: (id, status) => api.put(`/orders/${id}`, { status }),
  cancel: id => api.put(`/orders/${id}/cancel`),
}

// Auth API
export const authAPI = {
  register: (name, email, password, phone) =>
    api.post('/users/register', { name, email, password, phone }),
  login: (email, password) =>
    api.post('/users/login', { email, password }),
  getMe: () => {
    const token = localStorage.getItem('token')
    return api.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
  },
  updateProfile: data => {
    const token = localStorage.getItem('token')
    return api.put('/users/profile', data, {
      headers: { Authorization: `Bearer ${token}` },
    })
  },
  addToFavorites: restaurantId => {
    const token = localStorage.getItem('token')
    return api.post('/users/favorites', { restaurantId }, {
      headers: { Authorization: `Bearer ${token}` },
    })
  },
  removeFromFavorites: restaurantId => {
    const token = localStorage.getItem('token')
    return api.delete(`/users/favorites/${restaurantId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  },
}

export default api
