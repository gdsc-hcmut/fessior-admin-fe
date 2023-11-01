import api from './api';
// import ITargetGroup from '../../type/target-group-type';

const getAll = async () => {
	return (await api.get('/v1/admin/api/target-groups')).data.payload;
};

const getById = async (id: string) => {
	return (await api.get(`/v1/admin/api/target-groups/${id}`)).data.payload;
};

export default { getAll, getById };
