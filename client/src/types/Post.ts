export interface CreatePostData {
	userId: string;
	description?: string;
	image?: string;
}

export interface CreatePostProps {
	setIsOpenModal: (open: boolean) => void;
}

export interface Post {
	_id: string;
	userId: {
		username: string;
	};
	description?: string;
	image: {
		url: string;
		public_id: string;
	};
	likes: string[];
	comments: Comment[];
	createdAt: string;
	updatedAt: string;
}

export type UserComment = {
	_id: string;
	username: string;
	avatar?: string;
};

export type Comment = {
	_id: string;
	userId: UserComment;
	comment: string;
	createdAt: string;
};
