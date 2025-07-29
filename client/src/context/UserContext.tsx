import { createContext } from 'react';
import type { User } from '../types/User';

export interface UserContextType {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	login: (user: User) => void;
	logout: () => void;
	loading: boolean;
	addFriend: (friendId: string) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
	undefined
);
