// useAxiosInterceptors.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './useUser';
import api from '../services/axios';

const useAxiosInterceptors = () => {
	const navigate = useNavigate();
	const { logout } = useUser();

	useEffect(() => {
		const responseInterceptor = api.interceptors.response.use(
			(response) => response,
			async (error) => {
				const originalRequest = error.config;
				if (originalRequest.url.includes('/auth/refresh-token')) {
					logout();
					navigate('/login');
					return Promise.reject(error);
				}
				if (
					error.response &&
					(error.response.status === 401 ||
						error.response.status === 403) &&
					!originalRequest._retry
				) {
					originalRequest._retry = true;
					try {
						await api.post(
							'/auth/refresh-token',
							{},
							{ withCredentials: true }
						);
						return api(originalRequest);
					} catch (refreshError) {
						logout();
						navigate('/login');
						return Promise.reject(refreshError);
					}
				}
				return Promise.reject(error);
			}
		);

		return () => {
			api.interceptors.response.eject(responseInterceptor);
		};
	}, [navigate, logout]);
};

export default useAxiosInterceptors;
