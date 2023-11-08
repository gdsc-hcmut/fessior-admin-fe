import api from './api';
import IFeatureFlag from '../../type/feature-flag-type';

const getAll = async () => {
	return (await api.get('/v1/admin/api/feature-flags')).data.payload;
};

const create = async (payload: IFeatureFlag) => {
	return (await api.post('/v1/admin/api/feature-flags', payload)).data.payload;
};

const update = async (id: string, payload: IFeatureFlag) => {
	return (await api.patch(`/v1/admin/api/feature-flags/${id}`, payload)).data.payload;
};

const deleteById = async (id: string) => {
	return (await api.delete(`/v1/admin/api/feature-flags/${id}`)).data.payload;
};

export default { getAll, create, update, deleteById };
