import { FC } from 'react';
import Image from 'next/image';

export interface IUserProps {
	picture: string;
	fullName: string;
}

const User: FC<IUserProps> = ({ picture, fullName }) => {
	return (
		<>
			<Image
				className='rounded-full inline-block me-2'
				alt='avatar'
				src={picture}
				width={30}
				height={30}
			/>
			{fullName}
		</>
	);
};

export default User;
