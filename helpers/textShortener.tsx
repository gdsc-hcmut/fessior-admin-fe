import Tooltips from '../components/bootstrap/Tooltips';

const textShortener = (s: string, maxLength: number) => {
	return s.length > maxLength ? (
		<Tooltips className='mb-3 text-[13px]' title={s}>
			{`${s.slice(0, maxLength)}...`}
		</Tooltips>
	) : (
		s
	);
};

export default textShortener;
