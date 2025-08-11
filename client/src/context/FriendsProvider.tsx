import { useEffect, useState, type ReactNode } from 'react';
import type { User } from '../types/User';
import {
	addFriends,
	getFriends,
	removeFriends,
} from '../services/friendsService';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useUser } from '../hooks/useUser';
import { FriendsContext } from './FriendsContext';

interface FriendsProviderProps {
	children: ReactNode;
}

const FriendsProvider = ({ children }: FriendsProviderProps) => {
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [myFriends, setMyFriends] = useState<User[]>([]);
	const { user, login } = useUser();

	const fetchFriends = async () => {
		if (!user?._id) return;
		setLoading(true);
		try {
			const { data } = await getFriends(user._id);
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
		if (user) {
			fetchFriends();
		}
	}, [user?._id]);

	const addFriend = async (friendId: string) => {
		try {
			const res = await addFriends(friendId);
			console.log(res.data);
			toast.success('Friend added!');
			if (user) {
				login({
					...user,
					friends: [...(user.friends || []), friendId],
				});
			}
			setMyFriends(res.data.friends);
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
		<FriendsContext.Provider
			value={{
				addFriend,
				removeFriend,
				myFriends,
			}}>
			{children}
		</FriendsContext.Provider>
	);
};

export default FriendsProvider;
