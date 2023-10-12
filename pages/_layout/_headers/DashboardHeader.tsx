import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
// import Image from 'next/image';
import Header, { HeaderLeft, HeaderRight } from '../../../layout/Header/Header';
import Popovers from '../../../components/bootstrap/Popovers';
import Button, { IButtonProps } from '../../../components/bootstrap/Button';
import Icon from '../../../components/icon/Icon';
import useDarkMode from '../../../hooks/useDarkMode';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import LANG, { getLangWithKey, ILang } from '../../../lang';
import Spinner from '../../../components/bootstrap/Spinner';
import showNotification from '../../../components/extras/showNotification';
import Avatar from '../../../components/Avatar';
import AuthContext from '../../../context/authContext';
import { Logout } from '../../../components/icon/material-icons';

const DashboardHeader = () => {
	const defaultAvt =
		'https://play-lh.googleusercontent.com/xlnwmXFvzc9Avfl1ppJVURc7f3WynHvlA749D1lPjT-_bxycZIj3mODkNV_GfIKOYJmG';
	const { userData, logout } = useContext(AuthContext);

	const router = useRouter();
	const { darkModeStatus, setDarkModeStatus } = useDarkMode();

	const styledBtn: IButtonProps = {
		color: darkModeStatus ? 'dark' : 'light',
		hoverShadow: 'default',
		isLight: !darkModeStatus,
		size: 'lg',
	};

	const { i18n } = useTranslation();

	const changeLanguage = (lng: ILang['key']['lng']) => {
		i18n.changeLanguage(lng);
		router.push(router.pathname, router.pathname, { locale: lng });
		showNotification(
			<span className='d-flex align-items-center'>
				<Icon icon={getLangWithKey(lng)?.icon} size='lg' className='me-1' />
				<span>{`Language changed to ${getLangWithKey(lng)?.text}`}</span>
			</span>,
			'You updated the language of the site. (Only "Aside" was prepared as an example.)',
		);
	};

	return (
		<Header>
			<HeaderLeft>
				<h2>Fessior Admin</h2>
			</HeaderLeft>
			<HeaderRight>
				<div className='row g-3 align-items-center'>
					<div className='col-auto'>
						<Popovers
							title='DashboardHeader.tsx'
							desc={<code>pages/_layout/_headers/DashboardHeader.tsx</code>}>
							HeaderRight
						</Popovers>
						<code className='ps-3'>DashboardHeader.tsx</code>
					</div>

					{/* Dark Mode */}
					<div className='col-auto'>
						<Popovers trigger='hover' desc='Dark / Light mode'>
							<Button
								// eslint-disable-next-line react/jsx-props-no-spreading
								{...styledBtn}
								onClick={() => setDarkModeStatus(!darkModeStatus)}
								className='btn-only-icon'
								data-tour='dark-mode'>
								<Icon
									icon={darkModeStatus ? 'DarkMode' : 'LightMode'}
									color={darkModeStatus ? 'info' : 'warning'}
									className='btn-icon'
								/>
							</Button>
						</Popovers>
					</div>

					{/* Lang Selector */}
					<div className='col-auto'>
						<Dropdown>
							<DropdownToggle hasIcon={false}>
								{typeof getLangWithKey(router.locale as ILang['key']['lng'])
									?.icon === 'undefined' ? (
									<Button
										// eslint-disable-next-line react/jsx-props-no-spreading
										{...styledBtn}
										className='btn-only-icon'
										aria-label='Change language'
										data-tour='lang-selector'>
										<Spinner isSmall inButton='onlyIcon' isGrow />
									</Button>
								) : (
									<Button
										// eslint-disable-next-line react/jsx-props-no-spreading
										{...styledBtn}
										icon={
											getLangWithKey(router.locale as ILang['key']['lng'])
												?.icon
										}
										aria-label='Change language'
										data-tour='lang-selector'
									/>
								)}
							</DropdownToggle>
							<DropdownMenu isAlignmentEnd data-tour='lang-selector-menu'>
								{Object.keys(LANG).map((i) => (
									<DropdownItem key={LANG[i].lng}>
										<Button
											icon={LANG[i].icon}
											onClick={() => changeLanguage(LANG[i].lng)}>
											{LANG[i].text}
										</Button>
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
					</div>
					<div className='col-auto'>
						<Dropdown>
							<DropdownToggle hasIcon={false}>
								<Button
									// eslint-disable-next-line react/jsx-props-no-spreading
									{...styledBtn}>
									<div className='col d-flex align-items-center cursor-pointer'>
										<div className='me-3'>
											<div className='text-end'>
												<div className='fw-bold fs-6 mb-0'>
													{userData?.firstName ?? 'NULL'}
												</div>
											</div>
										</div>
										<Avatar
											src={userData?.picture ?? defaultAvt}
											size={36}
											color='primary'
										/>
									</div>
								</Button>
							</DropdownToggle>
							<DropdownMenu isAlignmentEnd data-tour='lang-selector-menu'>
								<DropdownItem key='logout button'>
									<Button onClick={logout}>
										<Logout />
										<span>Logout</span>
									</Button>
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
				</div>
			</HeaderRight>
		</Header>
	);
};

export default DashboardHeader;
