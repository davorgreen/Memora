import { useUser } from '../../hooks/useUser';
import Profile from '../../assets/profilepicture.jpg';
import axios from 'axios';
import { usePeopleYouMayKnow } from './usePeopleMayYouKnow';

const PeopleMayYouKnow = () => {
	const { user, addFriend } = useUser();
	const { people, loading, error } = usePeopleYouMayKnow(user);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;

	const handleAddFriend = async (friendId: string) => {
		try {
			await addFriend(friendId);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				throw new Error(err.response?.data?.message || err.message);
			}
			throw new Error('Something went wrong while adding a friend.');
		}
	};

	return (
		<div className='bg-white rounded-lg p-4 shadow-md'>
			<h2 className='text-xl font-semibold mb-2'>
				People You May Know
			</h2>
			<ul className='flex gap-10'>
				{people.map((friend) => (
					<li key={friend._id} className='flex flex-col gap-4'>
						<div className='flex flex-col items-center'>
							<img src={Profile} className='w-20 h-20 rounded-full' />
							<span>{friend.username}</span>
						</div>
						<div className='flex gap-4'>
							<button
								onClick={() => handleAddFriend(friend._id)}
								className='w-20 h-10 bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-blue-700 cursor-pointer'>
								Add
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default PeopleMayYouKnow;
