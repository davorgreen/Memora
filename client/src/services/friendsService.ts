import api from './axios';

export const getFriends = (userId: string) => {
	return api.get(`/users/${userId}/friends`);
};

export const addFriends = (friendId: string) => {
	return api.post(`/users/add-friend`, { friendId });
};

export const removeFriends = (friendId: string) => {
	return api.post(`/users/remove-friend`, { friendId });
};

export const getFollower = () => {
	return api.get(`/users/followers`);
};
