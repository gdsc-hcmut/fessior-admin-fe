export default interface IAccessLevel {
	_id: string;
	name: string;
	permissions: string[];
	users: string[];
}
