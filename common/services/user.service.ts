import api from './api';

const getProfile = async () => {
	return api.get('v1/api/me');
};

const login = async (token: string) => {
	return api.post('v1/api/auth/login', {
		token,
	});
};

const logout = async () => {
	await api.post('v1/api/auth/logout', {
		token: JSON.parse(localStorage.getItem('token') || '{}'),
	});
	localStorage.removeItem('token');
};

const UserApi = {
	getProfile,
	login,
	logout,
};

export default UserApi;
