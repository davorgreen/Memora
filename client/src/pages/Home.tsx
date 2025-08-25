import { useNavigate } from 'react-router-dom';
import Profile from '../assets/profilepicture.jpg';
import PostCard from '../components/PostCard';
import PeopleMayYouKnow from '../components/PeopleMayYouKnow/PeopleMayYouKnow';
import { useState } from 'react';
import CreatePost from '../components/CreatePost/CreatePost';
import Navbar from '../components/Navbar';
import { useFriends } from '../hooks/useFriends';
import { useUser } from '../hooks/useUser';
import { ClipLoader } from 'react-spinners';
import { usePosts } from '../hooks/UsePosts';
import FriendModal from '../components/FriendModal';

const Home = () => {
	const navigate = useNavigate();
	const [openModalType, setOpenModalType] = useState<
		null | 'followers' | 'following'
	>(null);
	const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

	const { user } = useUser();
	const {
		myFriends,
		removeFriend,
		loadingFriends,
		errorFriends,
		followers,
	} = useFriends();
	const { myPosts } = usePosts();

	const closeModal = () => setOpenModalType(null);

	if (loadingFriends) {
		return (
			<div className='flex justify-center items-center h-64'>
				<ClipLoader color='#229ac5' size={50} />
			</div>
		);
	}

	if (errorFriends)
		return (
			<p className='font-bold text-2xl text-red-600'>
				Error: {errorFriends}
			</p>
		);

	return (
		<div className='min-h-screen bg-gray-100'>
			<Navbar />
			<main className='pt-16 mx-auto px-4 mt-6'>
				<section>
					<PeopleMayYouKnow />
					{/* User Profile */}
					<div className='flex items-center justify-center mb-4'>
						{user && (
							<div className='flex flex-col md:flex-row items-center gap-6 mt-4 mb-4 text-center'>
								<div>
									{' '}
									<img
										src={Profile}
										alt='User Profile'
										className='w-30 h-30 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 transition'
										onClick={() => navigate(`/profile/${user._id}`)}
									/>
								</div>
								<div>
									<p className='text-3xl'>
										{user.username || 'Guest'}
									</p>
									{/* Posts */}
									<div className='flex gap-6 sm:gap-10 justify-center mt-4 text-base sm:text-lg'>
										<div className='flex flex-col items-center'>
											<p>{myPosts?.length}</p>
											<p className='text-sm text-gray-500'>posts</p>
										</div>
										{/* Followers */}
										<div className='flex flex-col items-center'>
											<button
												onClick={() => setOpenModalType('followers')}
												className='flex flex-col items-center text-center cursor-pointer'>
												<p>{followers.length}</p>
												<p className='text-sm text-gray-500'>
													followers
												</p>
											</button>
										</div>
										{/* Following */}
										<div className='flex flex-col items-center'>
											<button
												onClick={() => setOpenModalType('following')}
												className='flex flex-col items-center text-center cursor-pointer'>
												<p className='text-lg font-semibold'>
													{myFriends.length}
												</p>
												<p className='text-sm text-gray-500'>
													following
												</p>
											</button>
										</div>
									</div>
									{/* Friend Modal */}
									{openModalType && (
										<FriendModal
											friends={
												openModalType === 'followers'
													? followers
													: myFriends
											}
											isOpen={true}
											onClose={closeModal}
											canRemove={openModalType === 'following'}
											removeFriend={removeFriend}
											title={
												openModalType === 'followers'
													? 'Followers'
													: 'Following'
											}
										/>
									)}
								</div>
							</div>
						)}
					</div>
					{/* Create post */}
					<div className='flex justify-center'>
						<button
							onClick={() => setIsCreatePostOpen(!isCreatePostOpen)}
							className='text-xl font-semibold mb-4 rounded-xl h-16 bg-blue-400 w-full sm:w-2/3 md:w-1/2'>
							<p className='text-white text-2xl sm:text-3xl'>
								+ Create post
							</p>
						</button>
					</div>
					{isCreatePostOpen && (
						<div>
							<CreatePost setIsOpenModal={setIsCreatePostOpen} />
						</div>
					)}
					<div className='w-full max-w-xl mx-auto flex flex-col gap-20 p-4'>
						<PostCard />
					</div>
				</section>
			</main>
		</div>
	);
};

export default Home;
