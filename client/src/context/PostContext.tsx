import { createContext } from 'react';
import type { Post } from '../types/Post';

export interface PostsContextType {
	posts: Post[] | null;
	addPost: (newPost: Post) => void;
	loadingPosts: boolean;
	errorPosts: string | null;
}

export const PostsContext = createContext<
	PostsContextType | undefined
>(undefined);
