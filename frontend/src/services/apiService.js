import axios from "axios";

// Base URLs for different services
const USER_SERVICE_URL = "http://localhost:3001/api";
const RIDE_SERVICE_URL = "http://localhost:3002/api";
const PAYMENT_SERVICE_URL = "http://localhost:3003/api";
const ADMIN_SERVICE_URL = "http://localhost:3004/api";

// Create axios instances for each service with interceptors
const createAxiosInstance = (baseURL) => {
  const instance = axios.create({ baseURL });

  // Request interceptor to add auth token
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

const userApi = createAxiosInstance(USER_SERVICE_URL);
const rideApi = createAxiosInstance(RIDE_SERVICE_URL);
const paymentApi = createAxiosInstance(PAYMENT_SERVICE_URL);
const adminApi = createAxiosInstance(ADMIN_SERVICE_URL);

// User Service APIs
export const userService = {
  login: async (email, password) => {
    const response = await userApi.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await userApi.post("/auth/register", userData);
    return response.data;
  },

  logout: async () => {
    const response = await userApi.post("/auth/logout");
    return response.data;
  },

  verifyToken: async () => {
    const response = await userApi.get("/users/verify");
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await userApi.get(`/users/${userId}`);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await userApi.put("/users/profile", profileData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await userApi.put("/users/password", passwordData);
    return response.data;
  },
};

// Ride Service APIs
export const rideService = {
  createRide: async (rideData) => {
    const response = await rideApi.post("/rides", rideData);
    return response.data;
  },

  // For passengers - get their own ride requests
  getPassengerRides: async () => {
    const response = await rideApi.get("/rides");
    return response.data;
  },

  // For drivers - get available ride requests to apply for
  getAvailableRides: async () => {
    const response = await rideApi.get("/rides");
    return response.data;
  },

  // Get specific ride details by ID
  getRideById: async (rideId) => {
    const response = await rideApi.get(`/rides/${rideId}`);
    return response.data;
  },

  applyForRide: async (rideRequestId) => {
    const response = await rideApi.post(`/rides/${rideRequestId}/apply`);
    return response.data;
  },

  getRideApplications: async (rideRequestId) => {
    const response = await rideApi.get(`/rides/${rideRequestId}/applications`);
    return response.data;
  },

  selectDriver: async (rideRequestId, driverId) => {
    const response = await rideApi.post(`/rides/${rideRequestId}/select`, {
      driverId,
    });
    return response.data;
  },

  cancelRide: async (rideRequestId) => {
    const response = await rideApi.post(`/rides/${rideRequestId}/cancel`);
    return response.data;
  },

  completeRide: async (rideRequestId) => {
    const response = await rideApi.post(`/rides/${rideRequestId}/complete`);
    return response.data;
  },
}; // Payment Service APIs
export const paymentService = {
  recordPayment: async (rideRequestId, amount) => {
    const response = await paymentApi.post(`/payments/${rideRequestId}`, {
      amount,
    });
    return response.data;
  },

  generateReceipt: async (paymentId) => {
    const response = await paymentApi.post(`/payments/${paymentId}/receipt`);
    return response.data;
  },
};

// Admin Service APIs
export const adminService = {
  getAllUsers: async () => {
    const response = await adminApi.get("/admin/users");
    return response.data;
  },

  updateUserStatus: async (userId, statusData) => {
    const response = await adminApi.patch(
      `/admin/users/${userId}/status`,
      statusData
    );
    return response.data;
  },

  deactivateUser: async (userId) => {
    const response = await adminApi.patch(`/admin/users/${userId}/deactivate`);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await adminApi.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getAllRides: async (status = "") => {
    const response = await adminApi.get(
      `/admin/rides${status ? `?status=${status}` : ""}`
    );
    return response.data;
  },

  updateRideStatus: async (rideId, statusData) => {
    const response = await adminApi.patch(
      `/admin/rides/${rideId}/status`,
      statusData
    );
    return response.data;
  },

  deleteRide: async (rideId) => {
    const response = await adminApi.delete(`/admin/rides/${rideId}`);
    return response.data;
  },

  getSystemStats: async () => {
    const response = await adminApi.get("/admin/stats");
    return response.data;
  },
};
