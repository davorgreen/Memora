import { useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import api from '../services/axios';

const Home = () => {
	const { user } = useUser();
	console.log(user);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await api.get('/users');
				console.log('users:', res.data);
			} catch (err) {
				console.error('error:', err);
			}
		};

		fetchUser();
	}, []);

	return <div>Home</div>;
};

export default Home;
