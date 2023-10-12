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

export default instance;
