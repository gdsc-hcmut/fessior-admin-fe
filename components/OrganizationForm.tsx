// LIB
import { FC, useState, useEffect, useRef } from 'react';
// SERVICE
import UserService from '../common/services/user.service';
// TYPE
import IOrganization from '../type/organization-type';
import IUser from '../type/user-type';
import TMultiSelectItem from '../type/multi-select-type';
// HELPER
import { idsToObjects } from '../helpers/helpers';
// COMPONENT
import OffCanvas, { OffCanvasHeader, OffCanvasTitle, OffCanvasBody } from './bootstrap/OffCanvas';
import FormGroup from './bootstrap/forms/FormGroup';
import Input from './bootstrap/forms/Input';
import Label from './bootstrap/forms/Label';
import Button from './bootstrap/Button';
import MultiSelect from './MultiSelect';

interface IOrganizationFormProps {
	mode: 'edit' | 'create';
	organization?: IOrganization;
	onEdit?: (
		organizationId: string,
		longName: string,
		shortName: string,
		managers: string[],
		domains: string[],
	) => () => Promise<void>;
	onCreate?: (
		longName: string,
		shortName: string,
		managers: string[],
		domains: string[],
	) => () => Promise<void>;
	isShown: boolean;
	setIsShown: () => void;
	domainOptions: string[];
}

const OrganizationForm: FC<IOrganizationFormProps> = ({
	mode,
	organization,
	onEdit,
	onCreate,
	isShown,
	setIsShown,
	domainOptions,
}) => {
	const [shortName, setShortName] = useState(organization ? organization.shortName : '');
	const [longName, setLongName] = useState(organization ? organization.longName : '');
	const [managerValues, setManagerValues] = useState<IUser[] | null>(null);
	const [managerOptions, setManagerOptions] = useState<IUser[] | null>(null);
	const [domainValues, setDomainValues] = useState(organization ? organization.domains : []);
	const [hasChanged, setHasChanged] = useState(false);
	const renderCount = useRef(0);

	useEffect(() => {
		if (renderCount.current <= 1) {
			renderCount.current += 1;
		} else {
			setHasChanged(true);
		}
	}, [shortName, longName, managerValues, managerOptions, domainValues]);

	useEffect(() => {
		(async () => {
			const managersInitial = await UserService.getAll();
			setManagerOptions(managersInitial);
			setManagerValues(
				organization ? idsToObjects(organization.managers, managersInitial) : [],
			);
		})();
	}, []);

	if (!managerValues || !managerOptions) return null;

	const handleChanges = (fieldName: string) => {
		switch (fieldName) {
			case 'shortName':
				return (event: InputEvent) =>
					setShortName((event.currentTarget as HTMLInputElement).value);
			case 'longName':
				return (event: InputEvent) =>
					setLongName((event.currentTarget as HTMLInputElement).value);
			case 'managers':
				return (manager: IUser) => {
					if (managerValues.find((selected) => selected._id === manager._id)) {
						setManagerValues(
							managerValues.filter((selected) => selected._id !== manager._id),
						);
					} else {
						setManagerValues(managerValues.concat([manager]));
					}
				};
			case 'domains':
				return (domain: string) => {
					if (domainValues.find((selected) => selected === domain)) {
						setDomainValues(domainValues.filter((selected) => selected !== domain));
					} else {
						setDomainValues(domainValues.concat([domain]));
					}
				};
			default:
				return () => {};
		}
	};

	const emptyForm = () => {
		setShortName('');
		setLongName('');
		setManagerValues([]);
		setDomainValues([]);
	};

	return (
		<OffCanvas isOpen={isShown} setOpen={() => {}}>
			<OffCanvasHeader setOpen={setIsShown}>
				<OffCanvasTitle id={organization ? organization._id : ''}>
					{mode === 'edit' ? 'Edit Feature Flag' : 'Create New Feature Flag'}
				</OffCanvasTitle>
			</OffCanvasHeader>
			<OffCanvasBody>
				<FormGroup>
					<div className='flex flex-col'>
						<div className='mb-3'>
							<Label htmlFor='shortName'>Short Name</Label>
							<Input
								className='border'
								id='shortName'
								onInput={handleChanges('shortName')}
								value={shortName}
							/>
						</div>
						<div className='my-3'>
							<Label htmlFor='longName'>Long Name</Label>
							<Input
								className='border'
								id='longName'
								onInput={handleChanges('longName')}
								value={longName}
							/>
						</div>
						<div className='my-3'>
							<Label htmlFor='managers'>Managers</Label>
							<MultiSelect
								onSelect={
									handleChanges('managers') as (manager: TMultiSelectItem) => void
								}
								values={managerValues}
								options={managerOptions}
							/>
						</div>
						<div className='my-3'>
							<Label htmlFor='domains'>Domains</Label>
							<MultiSelect
								onSelect={
									handleChanges('domains') as (domain: TMultiSelectItem) => void
								}
								values={domainValues}
								options={domainOptions}
							/>
						</div>
						<Button
							className='mt-5'
							onClick={() => {
								if (mode === 'edit' && onEdit && organization) {
									onEdit(
										organization._id,
										shortName,
										longName,
										managerValues.map((manager) => manager._id),
										domainValues,
									)();
								} else if (mode === 'create' && onCreate) {
									onCreate(
										shortName,
										longName,
										managerValues.map((manager) => manager._id),
										domainValues,
									)();
									emptyForm();
								}
								setIsShown();
							}}
							isDisable={!hasChanged}
							rounded={1}
							type='submit'
							color='primary'>
							{mode === 'edit' ? 'SAVE' : 'CREATE'}
						</Button>
					</div>
				</FormGroup>
			</OffCanvasBody>
		</OffCanvas>
	);
};

export default OrganizationForm;
