import axios from 'axios';

// Crear una instancia de Axios
const api = axios.create({
  baseURL: 'http://localhost:5000', // URL de tu backend
});

// Función para obtener los tokens del almacenamiento local
const getTokens = () => ({
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
});

// Función para actualizar los tokens
const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

// Interceptor para añadir el token en cada petición
api.interceptors.request.use((config) => {
  const { accessToken } = getTokens();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Interceptor de respuesta para manejar el 401 y refrescar el token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const { refreshToken } = getTokens();
        if (!refreshToken) throw new Error('No refresh token');

        // Intentar refrescar el token
        const { data } = await axios.post('http://localhost:5000/refresh-token', { refreshToken });
        
        // Actualizar tokens y reintentar la petición original
        setTokens(data.token, data.refreshToken);
        error.config.headers.Authorization = `Bearer ${data.token}`;
        return api(error.config);
      } catch (refreshError) {
        console.error('Error al refrescar el token:', refreshError);
        // Redirigir al login si el refreshToken también falla
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
