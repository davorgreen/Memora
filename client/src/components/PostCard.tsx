import { FaRegHeart } from 'react-icons/fa';
import { FaRegComment } from 'react-icons/fa';
import Profile from '../assets/profilepicture.jpg';
import { useUser } from '../hooks/useUser';

const PostCard = () => {
	const { posts } = useUser();

	return (
		<div className='grid grid-cols-1 gap-6'>
			{!posts || posts.length === 0 ? (
				<p className='text-3xl text-red-600 font-semibold'>
					No posts available
				</p>
			) : (
				posts.map((post) => (
					<div
						key={post._id}
						className=' w-full h-full rounded-xl shadow-md overflow-hidden border-4 border-blue-200 bg-blue-100'>
						<img
							src={post.image?.url || Profile}
							alt='post'
							className='w-full h-auto'
						/>
						<div className='p-4 flex flex-col gap-4 items-start justify-between'>
							<div className='text-gray-800 font-semibold text-lg cursor-pointer hover:text-blue-500 transition'>
								{post.userId?.username || 'Unknown'}
							</div>
							<div className='text-gray-800'>{post.description}</div>
							<div className='flex gap-6 items-center'>
								<button className='flex items-center gap-1 text-gray-600 hover:text-red-500 transition'>
									<FaRegHeart size={24} />
									<span>{post.likes?.length}</span>
								</button>
								<button className='flex items-center gap-1 text-gray-600 hover:text-blue-500 transition'>
									<FaRegComment size={24} />
									<span>{post.comments?.length}</span>
								</button>
							</div>
						</div>
					</div>
				))
			)}
		</div>
	);
};

export default PostCard;
