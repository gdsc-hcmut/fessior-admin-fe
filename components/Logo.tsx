import React, { FC } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

interface ILogoProps {
	width?: number;
	height?: number;
}
const Logo: FC<ILogoProps> = ({ width, height }) => {
	return <Image height={height} width={width} alt='Fessior logo' src='/fessior.svg' />;
};
Logo.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
};
Logo.defaultProps = {
	width: 2155,
	height: 854,
};

export default Logo;
