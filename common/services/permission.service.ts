const SAMPLE_PERMISSION = ['READ_ALL_USERS', 'READ_USER_BY_ID', 'DELETE_USER_BY_ID'];

const getAll = async () => {
	return Promise.resolve(SAMPLE_PERMISSION);
};

export default { getAll };
