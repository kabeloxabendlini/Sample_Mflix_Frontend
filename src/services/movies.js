import axios from "axios";

// Backend URL from environment, fallback to localhost for dev
const BASE_URL =
  process.env.REACT_APP_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:7000";

// Axios instance with timeout and credentials
const api = axios.create({
  baseURL: BASE_URL + "/api/v1/movies",
  withCredentials: true, // use cookies if backend requires auth
  timeout: 10000,        // 10-second timeout
});

// Centralized error handling
const handleAxiosError = (error, context = "") => {
  if (error.response) {
    console.error(`[${context}] Server error:`, error.response.status, error.response.data);
  } else if (error.request) {
    console.error(`[${context}] Network error: No response received`, error.request);
  } else {
    console.error(`[${context}] Error:`, error.message);
  }
  throw error; // Rethrow for frontend handling
};

class MovieDataService {
  async getAll() {
    try {
      const res = await api.get("/");
      return res.data;
    } catch (error) {
      handleAxiosError(error, "getAll");
    }
  }

  async get(id) {
    if (!id) throw new Error("Movie ID is required");
    try {
      const res = await api.get(`/${id}`);
      return res.data;
    } catch (error) {
      handleAxiosError(error, `get(${id})`);
    }
  }

  async getRatings() {
    try {
      const res = await api.get("/ratings");
      return res.data;
    } catch (error) {
      handleAxiosError(error, "getRatings");
    }
  }

  async find(query, by) {
    if (!query || !by) throw new Error("Query and field are required");
    try {
      const res = await api.get(`?${by}=${query}`);
      return res.data;
    } catch (error) {
      handleAxiosError(error, `find(${by}=${query})`);
    }
  }

  async createReview(data) {
    if (!data?.movie_id) throw new Error("Movie ID is required for review");
    try {
      const res = await api.post(`/${data.movie_id}/reviews`, data);
      return res.data;
    } catch (error) {
      handleAxiosError(error, "createReview");
    }
  }

  async updateReview(data) {
    if (!data?.movie_id) throw new Error("Movie ID is required for review update");
    try {
      const res = await api.put(`/${data.movie_id}/reviews`, data);
      return res.data;
    } catch (error) {
      handleAxiosError(error, "updateReview");
    }
  }

  async deleteReview(reviewId, userId) {
    if (!reviewId || !userId) throw new Error("Review ID and User ID are required");
    try {
      const res = await api.delete("/reviews", {
        data: { review_id: reviewId, user_id: userId },
      });
      return res.data;
    } catch (error) {
      handleAxiosError(error, "deleteReview");
    }
  }
}

export default new MovieDataService();

// frontend/src/services/MovieDataService.js
// ----------------------------------------
// Axios instance + service class for all movie-related API calls

// import axios from "axios";

// // Create a single axios instance using environment variable
// // Make sure your frontend .env has:
// // REACT_APP_API_BASE_URL=https://sample-mflix-backend.onrender.com
// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_BASE_URL + "/api/v1/movies", // base path for all movie endpoints
//   withCredentials: true, // send cookies if needed
// });

// class MovieDataService {
//   // Fetch all movies
//   getAll() {
//     return api.get("/"); // GET /api/v1/movies/
//   }

//   // Fetch a single movie by ID
//   get(id) {
//     return api.get(`/${id}`); // GET /api/v1/movies/:id
//   }

//   // Fetch all available movie ratings
//   getRatings() {
//     return api.get("/ratings"); // GET /api/v1/movies/ratings
//   }

//   // Search for movies by field
//   find(query, by) {
//     return api.get(`?${by}=${query}`); // GET /api/v1/movies?title=...
//   }

//   // Create a new review
//   createReview(data) {
//     return api.post(`/${data.movie_id}/review`, data);
//     // POST /api/v1/movies/:movie_id/review
//   }

//   // Update an existing review
//   updateReview(data) {
//     return api.put(`/${data.movie_id}/review`, data);
//     // PUT /api/v1/movies/:movie_id/review
//   }

//   // Delete a review
//   deleteReview(reviewId, userId) {
//     return api.delete("/review", {
//       data: { review_id: reviewId, user_id: userId },
//     });
//   }
// }

// // Export a single instance
// const movieDataService = new MovieDataService();
// export default movieDataService;