import useAuthStore from '@/stores/authStore';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // local에서 refreshToken 쿠키 설정
});

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = accessToken;
  }
  return config;
});


apiClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { setAccessToken, signOut } = useAuthStore.getState();
    const originalRequest = err.config;
    // accessToken이 만료된 경우 갱신
    if (err.response.status === 401 && !originalRequest._retry) {
      try {
        originalRequest._retry = true; // 재귀호출 방지
        const tokenResponse = await apiClient.post('members/token');
        const accessToken = tokenResponse.headers.authorization;
        setAccessToken(accessToken);
        originalRequest.headers.Authorization = accessToken;
        return apiClient(originalRequest);
      } catch (refreshErr) {
        if (axios.isAxiosError(refreshErr)) {
          console.log(refreshErr.response?.data);
        }
        // 갱신에 실패한 경우 로그아웃
        signOut();
        window.location.href = '/signin';
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err);
  },
);

export default apiClient;
