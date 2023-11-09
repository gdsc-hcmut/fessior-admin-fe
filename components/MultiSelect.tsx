import { FC, useState } from 'react';
import Button from './bootstrap/Button';
import Input from './bootstrap/forms/Input';
import Card, { CardBody } from './bootstrap/Card';
import Dropdown, { DropdownItem, DropdownMenu, DropdownToggle } from './bootstrap/Dropdown';
import Icon from './icon/Icon';

interface IMultiSelectProps {
	values: string[];
	options: string[];
	onSelect: (item: string) => void;
}

const MultiSelect: FC<IMultiSelectProps> = ({ values, options, onSelect }) => {
	const [search, setSearch] = useState('');
	const nonValues = options.filter(
		(item) => !values.find((selectedItem) => selectedItem === item),
	);

	return (
		<>
			<Dropdown>
				<DropdownToggle>
					<Input
						placeholder={`${values.length} selected`}
						value={search}
						onInput={(event: InputEvent) =>
							setSearch((event.currentTarget as HTMLInputElement).value)
						}
					/>
				</DropdownToggle>
				<DropdownMenu className='w-100'>
					{nonValues.map((item) => (
						<DropdownItem key={item}>
							{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
							<div
								role='menuitem'
								tabIndex={0}
								onClick={() => {
									onSelect(item);
								}}
								className='align-middle flex align-items-center'>
								{item}
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
								key={item}
								className='mx-1 my-2 inline-flex items-center'
								color='primary'
								isOutline>
								<span>{item}</span>
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
