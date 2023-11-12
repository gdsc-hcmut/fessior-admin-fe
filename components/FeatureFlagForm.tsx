import { FC, useState, useEffect, useRef } from 'react';
import useEventListener from '../hooks/useEventListener';
import ITargetGroup from '../type/target-group-type';
import IFeatureFlag from '../type/feature-flag-type';
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
		key: string,
		description: string,
		targetGroupsNames: string[],
		isEnabled: boolean,
	) => () => Promise<void>;
	isShown: boolean;
	setIsShown: () => void;
	targetGroups: ITargetGroup[];
}

const FeatureFlagForm: FC<IFeatureFlagFormProps> = ({
	mode,
	featureFlag,
	featureFlagId,
	onEdit,
	onCreate,
	isShown,
	setIsShown,
	targetGroups,
}) => {
	const [key, setKey] = useState(featureFlag ? featureFlag.key : '');
	const [description, setDescription] = useState(featureFlag ? featureFlag.description : '');
	const [targetGroupNames, setTargetGroupNames] = useState(
		featureFlag ? featureFlag.targetGroups : [],
	);
	const [isEnabled, setIsEnabled] = useState<boolean>(
		featureFlag ? featureFlag.isEnabled : false,
	);
	const [hasChanged, setHasChanged] = useState(false);
	const renderCount = useRef(0);

	useEventListener('keydown', (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			setIsShown();
		}
	});

	useEffect(() => {
		if (renderCount.current <= 1) {
			renderCount.current += 1;
		} else {
			setHasChanged(true);
		}
	}, [key, description, targetGroupNames, isEnabled]);

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
					if (targetGroupNames.find((selected) => selected === targetGroup)) {
						setTargetGroupNames(
							targetGroupNames.filter((selected) => selected !== targetGroup),
						);
					} else {
						setTargetGroupNames(targetGroupNames.concat([targetGroup]));
					}
				};
			default:
				return () => {};
		}
	};

	const emptyForm = () => {
		setKey('');
		setDescription('');
		setTargetGroupNames([]);
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
								className={`border ${mode === 'create' ? '' : 'bg-[#cccccc]'}`}
								id='key'
								disabled={mode === 'edit'}
								onInput={handleChanges('key')}
								value={key}
							/>
						</div>
						<div className='my-3'>
							<Label htmlFor='description'>Description</Label>
							<Input
								className='border'
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
								values={targetGroupNames}
								options={targetGroups.map((obj) => obj.name)}
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
									onEdit(
										featureFlagId!,
										description,
										targetGroupNames,
										isEnabled,
									)();
								} else if (mode === 'create' && onCreate) {
									onCreate(key, description, targetGroupNames, isEnabled)();
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
