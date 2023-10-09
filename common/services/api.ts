import axios from 'axios';

const instance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND,
});

instance.interceptors.request.use(
	(config) => {
		config.headers.Authorization = `Bearer ${JSON.parse(
			localStorage.getItem('token') || '{}',
		)}`;
		return config;
	},
	(error) => {
		console.log('Error in axios');
		Promise.reject(error);
	},
);

instance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response.status === 401) {
			console.log('Unauthorized');
		}
		return error;
	},
);

export default instance;
