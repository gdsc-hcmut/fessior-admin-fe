import api from './api';
import IOrganization from '../../type/organization-type';

const SAMPLE_ORGANIZATION = [
	{
		_id: '0',
		longName: 'Test Organization 0',
		shortName: 'TO0',
		managers: ['6530eb74ce1fc917a49731dc', '654a52a73cb47d97ae5df66f'],
		domains: ['hcmut.edu.vn'],
	},
	{
		_id: '1',
		longName: 'Test Organization 1',
		shortName: 'TO1',
		managers: ['6530eb74ce1fc917a49731dc', '654a52a73cb47d97ae5df66f'],
		domains: ['oisp.edu.vn'],
	},
	{
		_id: '2',
		longName: 'Test Organization 2',
		shortName: 'TO2',
		managers: ['6530eb74ce1fc917a49731dc', '654a52a73cb47d97ae5df66f'],
		domains: ['gdschcmut.dev'],
	},
	{
		_id: '3',
		longName: 'Test Organization 3',
		shortName: 'TO3',
		managers: ['6530eb74ce1fc917a49731dc', '654a52a73cb47d97ae5df66f'],
		domains: ['gdsc.dev.vn'],
	},
];

const getAll = async () => {
	// return (await api.get('/v1/admin/api/organizations')).data.payload;
	return Promise.resolve(SAMPLE_ORGANIZATION);
};

const create = async (payload: IOrganization) => {
	return (await api.post('/v1/admin/api/organizations', payload)).data.payload;
};

const update = async (id: string, payload: IOrganization) => {
	return (await api.patch(`/v1/admin/api/organizations/${id}`, payload)).data.payload;
};

const deleteById = async (id: string) => {
	return (await api.delete(`/v1/admin/api/organizations/${id}`)).data.payload;
};

export default { getAll, create, update, deleteById };
