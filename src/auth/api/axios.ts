import axios from "axios";
    const accesstoken= localStorage.getItem("auth");
    const auth = accesstoken && JSON.parse(accesstoken) ;
    


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json", 
        "Authorization": `Bearer ${auth?.accessToken}`, 


  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
