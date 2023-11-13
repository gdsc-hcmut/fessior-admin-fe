import api from './api';
import IAccessLevel from '../../type/access-level-type';

const getAll = async () => {
	return (await api.get('/v1/admin/api/access-levels')).data.payload;
};

const create = async (payload: IAccessLevel) => {
	return (await api.post('/v1/admin/api/access-levels', payload)).data.payload;
};

const update = async (id: string, payload: IAccessLevel) => {
	return (await api.patch(`/v1/admin/api/access-levels/${id}`, payload)).data.payload;
};

const deleteById = async (id: string) => {
	return (await api.delete(`/v1/admin/api/access-levels/${id}`)).data.payload;
};

export default { getAll, create, update, deleteById };
