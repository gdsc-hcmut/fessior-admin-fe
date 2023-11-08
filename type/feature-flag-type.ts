export interface IPlatform {
	name: string;
	minSupportedVersion: string;
}

export default interface IFeatureFlag {
	_id: string;
	key: string;
	description: string;
	targetGroups: string[];
	platforms: IPlatform[];
	isEnabled: boolean;
}
