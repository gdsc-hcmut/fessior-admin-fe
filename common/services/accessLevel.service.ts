import api from './api';

// export interface AccessLevelMovdel {
// 	_id: string;
// 	name: string;
// 	permissions: string[];
// 	users: string[];
// 	createdAt: string;
// 	createdBy: string;
// 	updatedAt: string;
// 	updatedBy: string;
// }

const getAll = async () => {
	return api.get('v1/admin/api/access-levels');
};

const deleteAccessLevel = async (id: string) => {
	await api.delete(`v1/admin/api/access-levels/${id}`);
};

const AccessLevelApi = {
	getAll,
	deleteAccessLevel,
};

export default AccessLevelApi;
