import api from '../../services/axios';
import type { User } from '../../types/User';

export const fetchPeopleYouMayKnow = async (): Promise<User[]> => {
	const { data } = await api.get('/users');
	return data;
};

export const filterPeople = (
	all: User[],
	currentUser: User | null
): User[] => {
	if (!currentUser) return [];
	return all.filter(
		(u) =>
			u._id !== currentUser._id &&
			!currentUser.friends?.includes(u._id)
	);
};

/*export const addFriend = async (friendId: string): Promise<void> => {
	try {
		await api.post(`/users/add-friend`, { friendId });
	} catch (err) {
		if (axios.isAxiosError(err)) {
			throw new Error(err.response?.data?.message || err.message);
		}
		throw new Error('Something went wrong while adding a friend.');
	}
};*/
