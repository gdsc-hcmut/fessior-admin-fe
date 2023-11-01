import { FC, useState, useEffect, useRef } from 'react';
import ITargetGroup from '../type/target-group-type';
import IFeatureFlag, { TKey } from '../type/feature-flag-type';
import OffCanvas, { OffCanvasHeader, OffCanvasTitle, OffCanvasBody } from './bootstrap/OffCanvas';
import FormGroup from './bootstrap/forms/FormGroup';
import Input from './bootstrap/forms/Input';
import Checks from './bootstrap/forms/Checks';
import Label from './bootstrap/forms/Label';
import Button from './bootstrap/Button';
import MultiSelect from './MultiSelect';

interface IFeatureFlagFormProps {
	mode: 'edit' | 'create';
	featureFlag?: IFeatureFlag;
	featureFlagId?: string;
	onEdit?: (
		featureFlagId: string,
		description: string,
		targetGroupsNames: string[],
		isEnabled: boolean,
	) => () => Promise<void>;
	onCreate?: (
		key: TKey,
		description: string,
		targetGroupsNames: string[],
		isEnabled: boolean,
	) => () => Promise<void>;
	isShown: boolean;
	setIsShown: () => void;
	targetGroupsObjects: ITargetGroup[];
}

const FeatureFlagForm: FC<IFeatureFlagFormProps> = ({
	mode,
	featureFlag,
	featureFlagId,
	onEdit,
	onCreate,
	isShown,
	setIsShown,
	targetGroupsObjects,
}) => {
	const [key, setKey] = useState(featureFlag ? featureFlag.key : '');
	const [description, setDescription] = useState(featureFlag ? featureFlag.description : '');
	const [targetGroups, seITargetGroups] = useState(featureFlag ? featureFlag.targetGroups : []);
	const [isEnabled, setIsEnabled] = useState<boolean>(
		featureFlag ? featureFlag.isEnabled : false,
	);
	const [hasChanged, setHasChanged] = useState(false);
	const renderCount = useRef(0);

	useEffect(() => {
		if (renderCount.current <= 1) {
			renderCount.current += 1;
		} else {
			setHasChanged(true);
		}
	}, [description, targetGroups, isEnabled]);

	const handleChanges = (fieldName: string) => {
		switch (fieldName) {
			case 'key':
				return (event: InputEvent) =>
					setKey((event.currentTarget as HTMLInputElement).value.toUpperCase());
			case 'description':
				return (event: InputEvent) =>
					setDescription((event.currentTarget as HTMLInputElement).value);
			case 'isEnabled':
				return () => setIsEnabled(!isEnabled);
			case 'targetGroups':
				return (targetGroup: string) => {
					if (targetGroups.find((selected) => selected === targetGroup)) {
						seITargetGroups(
							targetGroups.filter((selected) => selected !== targetGroup),
						);
					} else {
						seITargetGroups(targetGroups.concat([targetGroup]));
					}
				};
			default:
				return () => {};
		}
	};

	const emptyForm = () => {
		setKey('');
		setDescription('');
		seITargetGroups([]);
		setIsEnabled(false);
	};

	return (
		<OffCanvas isOpen={isShown} setOpen={() => {}}>
			<OffCanvasHeader setOpen={setIsShown}>
				<OffCanvasTitle id={featureFlag ? featureFlag._id : ''}>
					{mode === 'edit' ? 'Edit Feature Flag' : 'Create New Feature Flag'}
				</OffCanvasTitle>
			</OffCanvasHeader>
			<OffCanvasBody>
				<FormGroup>
					<div className='flex flex-col'>
						<div className='mb-3'>
							<Label htmlFor='key'>Key</Label>
							<Input
								className={mode === 'create' ? 'bg-[#c5e2ff]' : ''}
								id='key'
								disabled={mode === 'edit'}
								onInput={handleChanges('key')}
								value={key}
							/>
						</div>
						<div className='my-3'>
							<Label htmlFor='description'>Description</Label>
							<Input
								className='bg-[#c5e2ff]'
								id='description'
								onInput={handleChanges('description')}
								value={description}
							/>
						</div>
						<div className='my-3'>
							<Label htmlFor='targetGroups'>Target Groups</Label>
							<MultiSelect
								onSelect={
									handleChanges('targetGroups') as (targetGroup: string) => void
								}
								selected={targetGroups}
								fullList={targetGroupsObjects.map((obj) => obj.name)}
							/>
						</div>
						<div className='my-3'>
							<Label htmlFor='isEnabled'>isEnabled</Label>
							<Checks
								className='text-[30px] absolute left-[90px]'
								id='isEnabled'
								onChange={handleChanges('isEnabled')}
								type='switch'
								checked={isEnabled}
							/>
						</div>
						<Button
							className='mt-5'
							onClick={() => {
								if (mode === 'edit' && onEdit) {
									onEdit(featureFlagId!, description, targetGroups, isEnabled)();
								} else if (mode === 'create' && onCreate) {
									onCreate(key as TKey, description, targetGroups, isEnabled)();
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

export default FeatureFlagForm;
