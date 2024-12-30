import axios from "axios";

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Thêm token vào header của request
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Đảm bảo response có dữ liệu
    if (response && response.data) return response.data;
    return response;
  },
  async function (error) {
    if (error.response && error.response.status === 401) {
      // Kiểm tra lỗi 401 (Access Token hết hạn)

      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        // Gọi API refresh token để làm mới access token
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/users/refresh-token`,
          { refreshToken }
        );

        if (response.data.data.EC === 0 && response.data.data.access_token) {
          const newAccessToken = response.data.data.access_token;
          localStorage.setItem("access_token", newAccessToken);
          console.log("New access token:", newAccessToken);

          // Cập nhật lại request với access token mới và retry
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(error.config); // Retry original request
        } else {
          // Nếu refresh token không hợp lệ, yêu cầu đăng nhập lại
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          console.error("Refresh token error:", response.data.EM);

          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Nếu không thể refresh token, yêu cầu đăng nhập lại
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        console.error("Error refreshing token:", refreshError);

        return Promise.reject(refreshError);
      }
    }

    // Xử lý các lỗi khác không phải 401
    console.log(">>>>>error", error);
    if (error?.response?.data?.message) {
      alert(error.response.data.message); // Hiển thị thông báo lỗi từ server
    }
    return Promise.reject(error);
  }
);

export default instance;
