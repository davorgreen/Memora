import { useEffect, useState, type ReactNode } from 'react';
import { UserContext } from './UserContext';
import api from '../services/axios';
import type { User } from '../types/User';
import {
	addFriends,
	getFriends,
	removeFriends,
} from '../services/friendsService';
import { toast } from 'react-toastify';
import axios from 'axios';
interface UserProviderProps {
	children: ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
	const [user, setUser] = useState<User | null>(() => {
		const storedUser = localStorage.getItem('user');
		return storedUser ? JSON.parse(storedUser) : null;
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [myFriends, setMyFriends] = useState<User[]>([]);

	const login = (userData: User) => {
		setUser(userData);
		localStorage.setItem('user', JSON.stringify(userData));
	};

	const logout = async () => {
		await api.post('/auth/logout');
		setUser(null);
		localStorage.removeItem('user');
	};

	const fetchFriends = async () => {
		if (!user?._id) return;
		setLoading(true);
		try {
			const { data } = await getFriends(user._id);
			console.log(data);
			setMyFriends(data);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				toast.error(err.response?.data?.message || err.message);
				setError(err.response?.data?.message || err.message);
			} else {
				throw new Error(
					'Something went wrong while adding a friend.'
				);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user) fetchFriends();
	}, [myFriends, user?._id]);

	const addFriend = async (friendId: string) => {
		try {
			await addFriends(friendId);
			toast.success('Friend added!');
			if (user) {
				login({
					...user,
					friends: [...(user.friends || []), friendId],
				});
			}
			setMyFriends((prev) => [...prev, { _id: friendId } as User]);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				toast.error(err.response?.data?.message || err.message);
				setError(err.response?.data?.message || err.message);
			} else {
				toast.error('Something went wrong while adding a friend.');
			}
		}
	};

	const removeFriend = async (friendId: string) => {
		try {
			await removeFriends(friendId);
			toast.success('Friend removed!');
			setMyFriends((prev) => prev.filter((f) => f._id !== friendId));
			if (user) {
				const updatedFriends =
					user.friends?.filter((id) => id !== friendId) || [];
				login({
					...user,
					friends: updatedFriends,
				});
			}
		} catch (err) {
			if (axios.isAxiosError(err)) {
				toast.error(err.response?.data?.message || err.message);
				setError(err.response?.data?.message || err.message);
			} else {
				toast.error('Failed to remove friend.');
			}
		}
	};

	return (
		<UserContext.Provider
			value={{
				user,
				login,
				logout,
				setUser,
				addFriend,
				removeFriend,
				myFriends,
				loading,
				error,
			}}>
			{children}
		</UserContext.Provider>
	);
};

export default UserProvider;
