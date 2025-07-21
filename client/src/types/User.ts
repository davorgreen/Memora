export interface User {
	username: string;
	_id: string;
	email: string;
	password?: string;
	isAdmin?: boolean;
}
