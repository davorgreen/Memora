import { useContext } from 'react';
import { FriendsContext } from '../context/FriendsContext';

export const useFriends = () => {
	const context = useContext(FriendsContext);
	if (!context) {
		throw new Error(
			'useFriendsContext must be used within FriendsProvider'
		);
	}
	return context;
};
