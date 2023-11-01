export interface IPlatform {
	name: string;
	minSupportedVersion: string;
}

export type TKey =
	| 'ShortenUrl'
	| 'UploadInformation'
	| 'GetUrlList'
	| 'GetUrl'
	| 'ImportUsersToOrganization';

export default interface IFeatureFlag {
	_id: string;
	key: TKey;
	description: string;
	targetGroups: string[];
	platforms: IPlatform[];
	isEnabled: boolean;
}
