import api from './api';
import ITargetGroup from '../../type/target-group-type';

const getAll = async () => {
	return (await api.get('/v1/admin/api/target-groups')).data.payload;
};

const getById = async (id: string) => {
	return (await api.get(`/v1/admin/api/target-groups/${id}`)).data.payload;
};

const create = async (payload: ITargetGroup) => {
	return (await api.post('/v1/admin/api/target-groups', payload)).data.payload;
};

const update = async (id: string, payload: ITargetGroup) => {
	return (await api.patch(`/v1/admin/api/target-groups/${id}`, payload)).data.payload;
};

const deleteById = async (id: string) => {
	return (await api.delete(`/v1/admin/api/target-groups/${id}`)).data.payload;
};

export default { getAll, getById, create, update, deleteById };
