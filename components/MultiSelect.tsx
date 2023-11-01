import { FC, useState, useRef } from 'react';
import Button from './bootstrap/Button';
import Input from './bootstrap/forms/Input';
import Card, { CardBody } from './bootstrap/Card';

interface IMultiSelectProps {
	selected: any[];
	fullList: any[];
	onSelect: (item: string) => void;
}

const MultiSelect: FC<IMultiSelectProps> = ({ selected, fullList, onSelect }) => {
	const [isSelecting, setIsSelecting] = useState(false);
	const [search, setSearch] = useState('');
	const blurBlock = useRef(false);
	const sortedAndSearchedFullList = fullList
		.filter((item) => item.toLowerCase().includes(search.toLowerCase()))
		.sort((a, b) => {
			const isASelected = selected.find((selectedItem) => a === selectedItem);
			const isBSelected = selected.find((selectedItem) => b === selectedItem);
			if (isASelected && !isBSelected) return -1;
			if (isBSelected && !isASelected) return 1;

			return 0;
		});

	return (
		<div
			className='w-100 relative'
			// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
			tabIndex={0}
			onFocus={() => setIsSelecting(true)}
			onBlur={() => {
				if (!blurBlock.current) setIsSelecting(false);
				blurBlock.current = false;
			}}>
			<div>
				<Input
					className='bg-[#c5e2ff]'
					placeholder={`${selected.length} selected`}
					value={search}
					onInput={(event: InputEvent) =>
						setSearch((event.currentTarget as HTMLInputElement).value)
					}
				/>
			</div>
			<Card
				className={`mt-3 z-[1] bg-[#c5e2ff] flex flex-wrap justify-between absolute w-100 max-h-[200px] overflow-auto ${
					isSelecting ? '' : 'hidden'
				}`}>
				<CardBody>
					{sortedAndSearchedFullList.map((item) => (
						<Button
							onMouseDown={() => {
								blurBlock.current = true;
								onSelect(item);
							}}
							onMouseUp={() => {
								blurBlock.current = false;
							}}
							key={item}
							className='mx-px my-2'
							color='primary'
							isOutline={!selected.find((selectedItem) => item === selectedItem)}>
							{item}
						</Button>
					))}
				</CardBody>
			</Card>
		</div>
	);
};

export default MultiSelect;
