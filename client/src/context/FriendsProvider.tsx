import { useEffect, useState, type ReactNode } from 'react';
import type { User } from '../types/User';
import {
	addFriends,
	getFollower,
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
	const [errorFriends, setErrorFriends] = useState('');
	const [loadingFriends, setLoadingFriends] = useState(false);
	const [myFriends, setMyFriends] = useState<User[]>([]);
	const [followers, setFollowers] = useState<User[]>([]);
	const [loadindgFollowers, setLoadingFollowers] =
		useState<boolean>(false);
	const [errorFollowers, setErrorFollowers] = useState('');
	const { user, login } = useUser();

	const fetchFriends = async () => {
		if (!user?._id) return;
		setLoadingFriends(true);
		try {
			const { data } = await getFriends(user._id);
			setMyFriends(data);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				toast.error(err.response?.data?.message || err.message);
				setErrorFriends(err.response?.data?.message || err.message);
			} else {
				throw new Error(
					'Something went wrong while adding a friend.'
				);
			}
		} finally {
			setLoadingFriends(false);
		}
	};

	const getFoll = async () => {
		setLoadingFollowers(true);
		try {
			const { data } = await getFollower();
			setFollowers(data ?? []);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				toast.error(err.response?.data?.message || err.message);
				setErrorFollowers(err.response?.data?.message || err.message);
			}
		} finally {
			setLoadingFollowers(false);
		}
	};

	useEffect(() => {
		if (user) {
			fetchFriends();
			getFoll();
		}
	}, [user?._id]);

	const addFriend = async (friendId: string) => {
		setLoadingFriends(true);
		try {
			const res = await addFriends(friendId);
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
				setErrorFriends(err.response?.data?.message || err.message);
			} else {
				toast.error('Something went wrong while adding a friend.');
			}
		} finally {
			setLoadingFriends(false);
		}
	};

	const removeFriend = async (friendId: string) => {
		setLoadingFriends(true);
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
				setErrorFriends(err.response?.data?.message || err.message);
			} else {
				toast.error('Failed to remove friend.');
			}
		} finally {
			setLoadingFriends(false);
		}
	};

	return (
		<FriendsContext.Provider
			value={{
				addFriend,
				removeFriend,
				myFriends,
				loadingFriends,
				errorFriends,
				followers,
			}}>
			{children}
		</FriendsContext.Provider>
	);
};

export default FriendsProvider;
