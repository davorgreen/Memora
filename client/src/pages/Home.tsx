import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { MdOutlinePhotoCamera } from 'react-icons/md';
import { FaRegBell } from 'react-icons/fa';
import { TbMessages } from 'react-icons/tb';
import Profile from '../assets/profilepicture.jpg';
import PostCard from '../components/PostCard';
import PeopleMayYouKnow from '../components/PeopleMayYouKnow/PeopleMayYouKnow';
import { useState } from 'react';

const Home = () => {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const { user, myFriends, removeFriend } = useUser();

	return (
		<div className='min-h-screen bg-gray-100'>
			<header className='flex justify-between items-center px-4 py-3 bg-white shadow-md fixed top-0 left-0 right-0 z-10'>
				<div
					className='text-4xl font-bold text-black-600 cursor-pointer flex items-center gap-4'
					onClick={() => navigate('/')}>
					<MdOutlinePhotoCamera size={40} /> Memora
				</div>
				<div className='flex gap-4'>
					<button className='relative'>
						<FaRegBell size={40} />
						<span className='absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full'>
							3
						</span>
					</button>
					<button className='relative'>
						<TbMessages size={45} />
						<span className='absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full'>
							3
						</span>
					</button>
				</div>
			</header>
			<main className='pt-16 mx-auto px-4 mt-6'>
				<section>
					<PeopleMayYouKnow />
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
									<div className='flex gap-6 sm:gap-10 justify-center mt-4 text-base sm:text-lg'>
										<div className='flex flex-col items-center'>
											<p>55</p>
											<p className='text-sm text-gray-500'>posts</p>
										</div>
										<div className='flex flex-col items-center'>
											<p>25</p>
											<p className='text-sm text-gray-500'>
												followers
											</p>
										</div>
										<div className='flex flex-col items-center'>
											<button
												onClick={() => setIsOpen((prev) => !prev)}
												className='flex flex-col items-center text-center cursor-pointer'>
												<p className='text-lg font-semibold'>
													{myFriends.length}
												</p>
												<p className='text-sm text-gray-500'>
													Following
												</p>
											</button>

											{isOpen && (
												<div className='mt-2 w-64 bg-blue-200 p-4 rounded-2xl shadow-lg flex flex-col gap-4'>
													{myFriends.map((fr) => (
														<div
															key={fr._id}
															className='flex justify-between items-center border-b border-gray-100 pb-2'>
															<p className='text-gray-800 font-medium'>
																{fr.username}
															</p>
															<button
																onClick={() => removeFriend(fr._id)}
																className='text-sm w-20 h-10 rounded-xl text-white font-semibold bg-red-500 hover:bg-red-700 transition'>
																Remove
															</button>
														</div>
													))}
													{myFriends.length === 0 && (
														<p className='text-sm text-gray-400 text-center'>
															No friends yet
														</p>
													)}
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
					<div className='flex justify-center'>
						<button className='text-xl font-semibold mb-4 rounded-xl h-16 bg-blue-400 w-full sm:w-2/3 md:w-1/2'>
							<p className='text-white text-2xl sm:text-3xl'>
								+ Create post
							</p>
						</button>
					</div>
					<div className='w-full max-w-xl mx-auto flex flex-col gap-20 p-4'>
						<PostCard />
						<PostCard />
					</div>
				</section>
			</main>
		</div>
	);
};

export default Home;
