import { FC, useState, useEffect } from 'react';
import textShortener from '../helpers/textShortener';
import Input from './bootstrap/forms/Input';
import Icon from './icon/Icon';

interface ITargetGroupNameProps {
	name: string;
	onNameChange: (name: string) => void;
	triggerToast?: (message: string, isSuccess: boolean) => void;
	onCancel?: () => void;
	isCreate?: boolean;
}

const MAX_TARGET_GROUP_NAME = 20;

const TargetGroupName: FC<ITargetGroupNameProps> = ({
	name,
	onNameChange,
	triggerToast,
	onCancel,
	isCreate,
}) => {
	const [currentName, setCurrentName] = useState(name);
	const [isChangingName, setIsChangingName] = useState(isCreate);
	const [isHovering, setIsHovering] = useState(false);
	const [forceInputState, setForceInputState] = useState(name === '');

	useEffect(() => {
		if (currentName === '') {
			setForceInputState(true);
		} else {
			setForceInputState(false);
		}
	}, [currentName]);
	console.log(isChangingName, forceInputState);

	return isChangingName || forceInputState ? (
		<Input
			onKeyDown={(e) => {
				if (e.key === 'Enter') e.currentTarget.blur();
			}}
			className='max-w-xs'
			autoFocus
			value={currentName}
			onInput={(e: InputEvent) => setCurrentName((e.currentTarget as HTMLInputElement).value)}
			onBlur={(e: FocusEvent) => {
				if (!forceInputState) {
					setIsChangingName(false);
					setIsHovering(false);
					setForceInputState(false);
					onNameChange(currentName);
				} else {
					if (onCancel) onCancel();
					else e.preventDefault();
					if (triggerToast) triggerToast('Empty name', false);
				}
			}}
		/>
	) : (
		/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */
		<p
			className='hover:cursor-pointer w-100 h-100'
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
			onKeyDown={() => {}}
			onClick={() => setIsChangingName(true)}>
			{textShortener(currentName, MAX_TARGET_GROUP_NAME)}
			{isHovering && <Icon className='inline' icon='Edit' />}
		</p>
	);
};

export default TargetGroupName;
