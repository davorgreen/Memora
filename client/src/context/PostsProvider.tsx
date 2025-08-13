import { useEffect, useState, type ReactNode } from 'react';
import api from '../services/axios';
import type { Post } from '../types/Post';
import { PostsContext } from './PostContext';
import { useUser } from '../hooks/useUser';
import axios from 'axios';
import { toast } from 'react-toastify';
interface UserProviderProps {
	children: ReactNode;
}

const PostsProvider = ({ children }: UserProviderProps) => {
	const [posts, setPosts] = useState<Post[] | null>([]);
	const [errorPosts, setErrorPosts] = useState('');
	const [loadingPosts, setLoadingPosts] = useState(false);
	const { user } = useUser();

	const getPosts = async () => {
		if (!user?._id) return;
		setLoadingPosts(true);
		try {
			const { data } = await api.get(`/posts/feed/${user._id}`);
			setPosts(data ?? []);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				toast.error(err.response?.data?.message || err.message);
				setErrorPosts(err.response?.data?.message || err.message);
			}
		} finally {
			setLoadingPosts(false);
		}
	};

	const addPost = (newPost: Post) => {
		setPosts((prev) => [
			{
				...newPost,
				userId: { username: user?.username || 'Unknown' },
			},
			...(prev || []),
		]);
	};

	useEffect(() => {
		if (user) {
			getPosts();
		}
	}, [user?._id]);

	return (
		<PostsContext.Provider
			value={{
				posts,
				addPost,
				loadingPosts,
				errorPosts,
			}}>
			{children}
		</PostsContext.Provider>
	);
};

export default PostsProvider;
