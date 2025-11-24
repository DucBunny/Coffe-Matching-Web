import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_BACKEND + '/api-v1',
  withCredentials: true,
})

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // const persistedData = localStorage.getItem("access_token");

    // let token = null;
    // if (persistedData) {
    //   try {
    //     const parsed = JSON.parse(persistedData);
    //     token = parsed?.state?.accessToken || null; // 👈 lấy đúng token
    //   } catch (e) {
    //     console.error("❌ Lỗi parse access_token:", e);
    //   }
    // }


    // // Thêm header Authorization nếu có token
    // if (token) {
    //   config.headers["Authorization"] = `Bearer ${token}`;
    // }


    // // test 
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MjFlOGQxYmVlNTcyY2E3MTA3YTlmYSIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3NjM5MTMwMTIsImV4cCI6MTc2Mzk5OTQxMn0.zDZvGXcMW7e-2xmHdyETpaHITeuiHCP8OuQ05uvjDbw'
    config.headers["Authorization"] = `Bearer ${testToken}`;

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
  // { synchronous: true, runWhen: () => /* This function returns true */ }
)

// Add a response interceptor
instance.interceptors.response.use(
  function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)

export default instance
