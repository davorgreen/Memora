import { useEffect, useState, type ReactNode } from 'react';
import { UserContext } from './UserContext';
import api from '../services/axios';
import type { User } from '../types/User';
import type { Post } from '../types/Post';
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
	const [posts, setPosts] = useState<Post[] | null>([]);

	const login = (userData: User) => {
		setUser(userData);
		localStorage.setItem('user', JSON.stringify(userData));
	};

	const logout = async () => {
		await api.post('/auth/logout');
		setUser(null);
		localStorage.removeItem('user');
	};

	const getPosts = async () => {
		if (!user?._id) return;

		try {
			const { data } = await api.get(`/posts/feed/${user._id}`);
			console.log(data);
			setPosts(data ?? []);
		} catch (error) {
			console.error('Failed to fetch posts:', error);
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
		<UserContext.Provider
			value={{
				user,
				login,
				logout,
				setUser,
				loading,
				error,
				posts,
				addPost,
			}}>
			{children}
		</UserContext.Provider>
	);
};

export default UserProvider;
