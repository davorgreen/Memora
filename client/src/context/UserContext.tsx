import { createContext } from 'react';
import type { User } from '../types/User';

export interface UserContextType {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	login: (user: User) => void;
	logout: () => void;
	myFriends: User[];
	addFriend: (friendId: string) => Promise<void>;
	removeFriend: (friendId: string) => Promise<void>;
	loading: boolean;
	error: string | null;
}

export const UserContext = createContext<UserContextType | undefined>(
	undefined
);
