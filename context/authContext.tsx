import React, {
	createContext,
	FC,
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { IUserProps } from '../common/data/userDummyData';
import UserApi from '../common/services/user.service';

export interface IAuthContextProps {
	isAuthenticated: boolean;
	setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
	userData: Partial<IUserProps>;
	getUserProfile: () => void;
	logout: () => void;
}
const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps);

interface IAuthContextProviderProps {
	children: ReactNode;
}
export const AuthContextProvider: FC<IAuthContextProviderProps> = ({ children }) => {
	// @ts-ignore
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [userData, setUserData] = useState<Partial<IUserProps>>({});
	const router = useRouter();

	const getUserProfile = useCallback(() => {
		UserApi.getProfile()
			.then((res) => {
				setUserData(res.data?.payload || {});
				setIsAuthenticated(true);
			})
			.catch(() => {
				setIsAuthenticated(false);
				localStorage.clear();
				router.push('/auth-pages/login');
			});
	}, [router]);

	const logout = useCallback(() => {
		UserApi.logout()
			.then(() => {
				setUserData({});
				setIsAuthenticated(false);
				localStorage.clear();
				router.push('/auth-pages/login');
			})
			.catch((err) => {
				console.log(err);
			});
	}, [router]);

	useEffect(() => {
		getUserProfile();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const value = useMemo(
		() => ({
			isAuthenticated,
			setIsAuthenticated,
			userData,
			getUserProfile,
			logout,
		}),
		[userData, isAuthenticated, getUserProfile, logout],
	);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
AuthContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export default AuthContext;
