import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const Home = () => {
	const navigate = useNavigate();
	const { user } = useUser();

	return (
		<div className='min-h-screen bg-gray-100'>
			<header className='flex justify-between items-center px-4 py-3 bg-white shadow-md fixed top-0 left-0 right-0 z-10'>
				<div
					className='text-2xl font-bold text-green-600 cursor-pointer'
					onClick={() => navigate('/')}>
					Memora
				</div>
				<div className='flex items-center space-x-4'>
					{user && (
						<img
							src={user.username || '/default-avatar.png'}
							alt='User Avatar'
							className='w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-green-500 transition'
							onClick={() => navigate(`/profile/${user._id}`)}
						/>
					)}
				</div>
			</header>
			<main className='pt-16 max-w-3xl mx-auto px-4'>
				<section className='mt-8 bg-white rounded-md shadow p-6'>
					<h1 className='text-xl font-semibold mb-4'>
						Welcome, {user?.username || 'Guest'}!
					</h1>
					<p className='text-gray-600'>
						This is your Instagram home feed.
					</p>
				</section>
			</main>
		</div>
	);
};

export default Home;
