import { useUser } from '../hooks/useUser';

const Home = () => {
	const { user } = useUser();
	console.log(user);
	return <div>Home</div>;
};

export default Home;
