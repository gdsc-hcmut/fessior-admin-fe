export default interface IOrganization {
	_id: string;
	longName: string;
	shortName: string;
	managers: string[];
	domains: string[];
}
