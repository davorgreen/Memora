import { useState, type ReactNode } from 'react';
import { UserContext } from './UserContext';
import api from '../services/axios';
import type { User } from '../types/User';
import axios from 'axios';
import { toast } from 'react-toastify';
interface UserProviderProps {
	children: ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
	const [user, setUser] = useState<User | null>(() => {
		const storedUser = localStorage.getItem('user');
		return storedUser ? JSON.parse(storedUser) : null;
	});
	const [errorUser, setErrorUser] = useState('');
	const [loadingUser, setLoadingUser] = useState(false);

	const login = (userData: User) => {
		setUser(userData);
		localStorage.setItem('user', JSON.stringify(userData));
	};

	const logout = async () => {
		setLoadingUser(true);
		try {
			await api.post('/auth/logout');
			setUser(null);
			localStorage.removeItem('user');
		} catch (err) {
			if (axios.isAxiosError(err)) {
				toast.error(err.response?.data?.message || err.message);
				setErrorUser(err.response?.data?.message || err.message);
			}
		} finally {
			setLoadingUser(false);
		}
	};

	return (
		<UserContext.Provider
			value={{
				user,
				login,
				logout,
				setUser,
				loadingUser,
				errorUser,
			}}>
			{children}
		</UserContext.Provider>
	);
};

export default UserProvider;
