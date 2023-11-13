// LIB
import { FC, useState, useEffect, useRef } from 'react';
// SERVICE
import UserService from '../common/services/user.service';
// TYPE
import IAccessLevel from '../type/access-level-type';
import IUser from '../type/user-type';
import TMultiSelectItem from '../type/multi-select-type';
// HELPER
import { idsToObjects } from '../helpers/helpers';
import useEventListener from '../hooks/useEventListener';
// COMPONENT
import OffCanvas, { OffCanvasHeader, OffCanvasTitle, OffCanvasBody } from './bootstrap/OffCanvas';
import FormGroup from './bootstrap/forms/FormGroup';
import Input from './bootstrap/forms/Input';
import Label from './bootstrap/forms/Label';
import Button from './bootstrap/Button';
import MultiSelect from './MultiSelect';

interface IAccessLevelFormProps {
	mode: 'edit' | 'create';
	accessLevel?: IAccessLevel;
	onEdit?: (
		accessLevelId: string,
		name: string,
		permissions: string[],
		users: string[],
	) => () => Promise<void>;
	onCreate?: (name: string, permissions: string[], users: string[]) => () => Promise<void>;
	isShown: boolean;
	setIsShown: () => void;
	permissionOptions: string[];
}

const AccessLevelForm: FC<IAccessLevelFormProps> = ({
	mode,
	accessLevel,
	onEdit,
	onCreate,
	isShown,
	setIsShown,
	permissionOptions,
}) => {
	const [name, setName] = useState(accessLevel ? accessLevel.name : '');
	const [userValues, setUserValues] = useState<IUser[] | null>(null);
	const [userOptions, setUserOptions] = useState<IUser[] | null>(null);
	const [permissionValues, setPermissionValues] = useState(
		accessLevel ? accessLevel.permissions : [],
	);
	const [hasChanged, setHasChanged] = useState(false);
	const renderCount = useRef(0);

	useEventListener('keydown', (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			setIsShown();
		}
	});

	useEffect(() => {
		(async () => {
			const usersInitial = await UserService.getAll();
			setUserOptions(usersInitial);
			setUserValues(accessLevel ? idsToObjects<IUser>(accessLevel.users, usersInitial) : []);
		})();
	}, [accessLevel]);

	useEffect(() => {
		if (renderCount.current <= 3) {
			renderCount.current += 1;
		} else {
			setHasChanged(true);
		}
	}, [name, permissionValues, userValues]);

	if (!(userValues && userOptions && permissionValues)) return null;

	const handleChanges = (fieldName: string) => {
		switch (fieldName) {
			case 'name':
				return (event: InputEvent) =>
					setName((event.currentTarget as HTMLInputElement).value);
			case 'permissions':
				return (permission: string) => {
					if (permissionValues.find((selected) => selected === permission)) {
						setPermissionValues(
							permissionValues.filter((selected) => selected !== permission),
						);
					} else {
						setPermissionValues(permissionValues.concat([permission]));
					}
				};
			case 'users':
				return (user: IUser) => {
					if (userValues.find((selected) => selected._id === user._id)) {
						setUserValues(userValues.filter((selected) => selected._id !== user._id));
					} else {
						setUserValues(userValues.concat([user]));
					}
				};
			default:
				return () => {};
		}
	};

	const emptyForm = () => {
		setName('');
		setPermissionValues([]);
		setUserValues([]);
	};

	return (
		<OffCanvas isOpen={isShown} setOpen={setIsShown}>
			<OffCanvasHeader setOpen={setIsShown}>
				<OffCanvasTitle id={accessLevel ? accessLevel._id : ''}>
					{mode === 'edit' ? 'Edit Access Level' : 'Create New Access Level'}
				</OffCanvasTitle>
			</OffCanvasHeader>
			<OffCanvasBody>
				<FormGroup>
					<div className='flex flex-col'>
						<div className='mb-3'>
							<Label htmlFor='name'>Name</Label>
							<Input id='name' onInput={handleChanges('name')} value={name} />
						</div>
						<div className='my-3'>
							<Label htmlFor='permissions'>Permissions</Label>
							<MultiSelect
								onSelect={
									handleChanges('permissions') as (
										permission: TMultiSelectItem,
									) => void
								}
								values={permissionValues}
								options={permissionOptions}
							/>
						</div>
						<div className='my-3'>
							<Label htmlFor='users'>Users</Label>
							<MultiSelect
								onSelect={
									handleChanges('users') as (user: TMultiSelectItem) => void
								}
								values={userValues}
								options={userOptions}
							/>
						</div>
						<Button
							className='mt-5'
							onClick={() => {
								if (mode === 'edit' && accessLevel && onEdit) {
									onEdit(
										accessLevel._id,
										name,
										permissionValues,
										userValues.map((user) => user._id),
									)();
								} else if (mode === 'create' && onCreate) {
									onCreate(
										name,
										permissionValues,
										userValues.map((user) => user._id),
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

export default AccessLevelForm;
