import { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';
import type { User } from '../types/User';
import api from '../services/axios';
import Profile from '../assets/profilepicture.jpg';
import { toast } from 'react-toastify';
import axios from 'axios';

const PeopleMayYouKnow = () => {
	const { user, addFriend } = useUser();
	const [friends, setFriends] = useState<User[]>([]);
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	console.log(user);

	const getAllFriends = async () => {
		setLoading(true);
		try {
			const response = await api.get('/users');
			const allUsers = response.data;
			const filteredUsers = allUsers.filter((u: User) => {
				return (
					u._id.toString() !== user?._id.toString() &&
					!user?.friends?.includes(u._id)
				);
			});
			setFriends(filteredUsers);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || err.message);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user?._id) {
			getAllFriends();
		}
	}, [user]);

	const handleAddFriend = async (friendId: string) => {
		try {
			const response = await api.post(`/users/add-friend`, {
				friendId,
			});
			addFriend(friendId);
			console.log('Friend added:', response.data);
			toast.success('Friend request sent!');
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || err.message);
			}
			toast.error('Something went wrong!');
		}
	};

	return (
		<div className='bg-white rounded-lg p-4 shadow-md'>
			<h2 className='text-xl font-semibold mb-2'>
				People You May Know
			</h2>
			<ul className='space-y-3'>
				{friends.map((friend) => (
					<li
						key={friend._id}
						className='flexs items-center justify-between'>
						<div className='flex items-center gap-2'>
							<img src={Profile} className='w-20 h-20 rounded-full' />
							<span>{friend.username}</span>
						</div>
						<div className='flex gap-4'>
							<button
								onClick={() => handleAddFriend(friend._id)}
								className='w-20 h-10 bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-blue-700 cursor-pointer'>
								Add
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default PeopleMayYouKnow;
