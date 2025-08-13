import { useContext } from 'react';
import { PostsContext } from '../context/PostContext';

export const usePosts = () => {
	const context = useContext(PostsContext);
	if (!context) {
		throw new Error(
			'useFriendsContext must be used within FriendsProvider'
		);
	}
	return context;
};
