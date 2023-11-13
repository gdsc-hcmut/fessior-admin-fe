import { FC, useState } from 'react';
import { FC, useState } from 'react';
import Button from './bootstrap/Button';
import Input from './bootstrap/forms/Input';
import Card, { CardBody } from './bootstrap/Card';
import Dropdown, { DropdownItem, DropdownMenu, DropdownToggle } from './bootstrap/Dropdown';
import Icon from './icon/Icon';
import IUser from '../type/user-type';
import User from './User';
import TMultiSelectItem from '../type/multi-select-type';

interface IMultiSelectProps {
	values: TMultiSelectItem[];
	options: TMultiSelectItem[];
	onSelect: (item: TMultiSelectItem) => void;
}

const isUser = (item: TMultiSelectItem): item is IUser => {
	return (item as IUser).firstName !== undefined;
};

const MultiSelect: FC<IMultiSelectProps> = ({ values, options, onSelect }) => {
	const [search, setSearch] = useState('');
	const searchedNonValues = options.filter((item) => {
		if (isUser(item))
			return (
				!(values as IUser[]).find((selectedItem) => selectedItem._id === item._id) &&
				`${item.lastName} ${item.firstName}`.toLowerCase().includes(search)
			);
		return (
			!values.find((selectedItem) => selectedItem === item) &&
			item.toLowerCase().includes(search)
		);
	});

	const renderItem = (item: TMultiSelectItem) => {
		if (isUser(item))
			return <User picture={item.picture} fullName={`${item.lastName} ${item.firstName}`} />;

		return item;
	};

	return (
		<>
			<Dropdown>
				<DropdownToggle>
					<Input
						placeholder={`${values.length} selected`}
						value={search}
						onInput={(event: InputEvent) =>
							setSearch((event.currentTarget as HTMLInputElement).value.toLowerCase())
							setSearch((event.currentTarget as HTMLInputElement).value.toLowerCase())
						}
					/>
				</DropdownToggle>
				<DropdownMenu className='w-100'>
					{searchedNonValues.map((item) => (
						<DropdownItem key={JSON.stringify(item)}>
							{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
							<div
								role='menuitem'
								tabIndex={0}
								onClick={() => onSelect(item)}
								className='align-middle flex align-items-center'>
								{renderItem(item)}
							</div>
						</DropdownItem>
					))}
				</DropdownMenu>
			</Dropdown>

			{values.length !== 0 && (
				<Card className='mt-3 flex flex-wrap justify-between w-100 max-h-[200px] border-2 overflow-auto'>
					<CardBody>
						{values.map((item) => (
							<Button
								onClick={() => {}}
								key={JSON.stringify(item)}
								className='mx-1 my-2 inline-flex items-center'
								color='primary'
								isOutline>
								<span>{renderItem(item)}</span>
								<Icon
									onClick={() => {
										onSelect(item);
									}}
									className='text-[20px] inline hover:text-[#b3170a] mx-px'
									icon='Close'
								/>
							</Button>
						))}
					</CardBody>
				</Card>
			)}
		</>
	);
};

export default MultiSelect;
