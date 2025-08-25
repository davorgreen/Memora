import { createContext } from 'react';
import type { User } from '../types/User';

export interface FriendsContextType {
	myFriends: User[];
	followers: User[];
	addFriend: (friendId: string) => Promise<void>;
	removeFriend: (friendId: string) => Promise<void>;
	loadingFriends: boolean;
	errorFriends: string | null;
}

export const FriendsContext = createContext<
	FriendsContextType | undefined
>(undefined);
