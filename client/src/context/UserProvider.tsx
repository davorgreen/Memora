import { useEffect, useState, type ReactNode } from 'react';
import { UserContext } from './UserContext';
import api from '../services/axios';
import type { User } from '../types/User';

interface UserProviderProps {
	children: ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
	const [user, setUser] = useState<User | null>(() => {
		const storedUser = localStorage.getItem('user');
		return storedUser ? JSON.parse(storedUser) : null;
	});
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const savedUser = localStorage.getItem('user');
		if (savedUser) setUser(JSON.parse(savedUser));
		setLoading(false);
	}, []);

	const login = (userData: User) => {
		setUser(userData);
		localStorage.setItem('user', JSON.stringify(userData));
	};

	const logout = async () => {
		await api.post('/auth/logout');
		setUser(null);
		localStorage.removeItem('user');
	};

	return (
		<UserContext.Provider
			value={{ user, login, logout, setUser, loading }}>
			{children}
		</UserContext.Provider>
	);
};

export default UserProvider;
