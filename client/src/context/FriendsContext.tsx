import { createContext } from 'react';
import type { User } from '../types/User';

export interface FriendsContextType {
	myFriends: User[];
	addFriend: (friendId: string) => Promise<void>;
	removeFriend: (friendId: string) => Promise<void>;
}

export const FriendsContext = createContext<
	FriendsContextType | undefined
>(undefined);
