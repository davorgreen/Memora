import { FaRegHeart } from 'react-icons/fa';
import { FaRegComment } from 'react-icons/fa';

import Profile from '../assets/profilepicture.jpg';
import { useUser } from '../hooks/useUser';
const PostCard = () => {
	const { user } = useUser();
	return (
		<div className=' rounded-xl shadow-md overflow-hidden  border-4 border-blue-200 bg-blue-100'>
			<img src={Profile} alt='post' className='w-full object-cover' />
			<div className='p-4 flex flex-col gap-4 items-start justify-between'>
				<div className='text-gray-800 font-semibold text-lg cursor-pointer hover:text-blue-500 transition'>
					{user ? user.username : 'guest'}
				</div>
				<div className='flex gap-4'>
					<button className=' text-gray-600 hover:text-red-500 transition'>
						<FaRegHeart size={30} />
					</button>
					<button className=' text-gray-600 hover:text-blue-500 transition'>
						<FaRegComment size={30} />
					</button>
				</div>
			</div>
		</div>
	);
};

export default PostCard;
