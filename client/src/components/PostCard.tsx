import { FaRegHeart, FaRegComment } from 'react-icons/fa';
import Profile from '../assets/profilepicture.jpg';
import { usePosts } from '../hooks/UsePosts';
import { ClipLoader } from 'react-spinners';
import { IoMdMore } from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';
import { CiEdit } from 'react-icons/ci';
import { IoSaveOutline } from 'react-icons/io5';
import { useState } from 'react';
import api from '../services/axios';
import axios from 'axios';
import { toast } from 'react-toastify';
import type { Post } from '../types/Post';
import { useUser } from '../hooks/useUser';

const PostCard = () => {
	const {
		posts,
		loadingPosts,
		errorPosts,
		deletePostById,
		setPosts,
		setMyPosts,
		myPosts,
	} = usePosts();
	const { user } = useUser();
	const [isOpenModal, setIsOpenModal] = useState<string | null>(null);
	const [loadingDeletePost, setLoadingDeletePost] = useState(false);
	const [errorDeletePost, setErrorDeletePost] = useState<
		string | null
	>(null);
	const [description, setDescription] = useState<string>('');
	const [editingPost, setEditingPost] = useState<string | null>(null);
	const [loadingEditPost, setLoadingEditPost] =
		useState<boolean>(false);
	const [errorEditPost, setErrorEditPost] = useState<string | null>(
		null
	);
	const modalContent =
		'flex items-center w-full h-full gap-2 px-4 py-2 text-gray-700 font-semibold hover:bg-blue-200 cursor-pointer transition';

	if (loadingPosts || loadingDeletePost || loadingEditPost) {
		return (
			<div className='flex justify-center items-center h-64'>
				<ClipLoader color='#229ac5' size={50} />
			</div>
		);
	}

	if (errorPosts || errorDeletePost || errorEditPost) {
		return (
			<p className='font-bold text-2xl text-red-600'>
				Error: {errorPosts || errorDeletePost}
			</p>
		);
	}

	const handleEditPost = (post: Post) => {
		setIsOpenModal(null);
		setEditingPost(post._id);
		setDescription(post.description || '');
	};

	const handleSave = async (postId: string) => {
		setLoadingEditPost(true);
		try {
			await api.put(`/posts/${postId}`, {
				userId: user?._id,
				description,
			});
			setPosts(
				posts?.map((p) =>
					p._id === postId ? { ...p, description } : p
				) ?? []
			);
			setMyPosts(
				myPosts?.map((p) =>
					p._id === postId ? { ...p, description } : p
				) ?? []
			);
			toast.success('Post successfully edited');
			setEditingPost(null);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				const message = err.response?.data?.message || err.message;
				setErrorEditPost(message);
				toast.error(message);
			}
		} finally {
			setLoadingEditPost(false);
		}
	};

	const handleDeletePost = async (id: string) => {
		setLoadingDeletePost(true);
		try {
			await api.delete(`/posts/${id}`);
			deletePostById(id);
			toast.success('Post deleted successfully!');
		} catch (err) {
			if (axios.isAxiosError(err)) {
				const message = err.response?.data?.message || err.message;
				setErrorDeletePost(message);
				toast.error(message);
			}
		} finally {
			setLoadingDeletePost(false);
		}
	};

	if (!posts || posts.length === 0) {
		return (
			<p className='text-3xl text-red-600 font-semibold'>
				No posts available
			</p>
		);
	}

	return (
		<div className='grid grid-cols-1 gap-6'>
			{posts
				.filter((post) => post.userId)
				.map((post) => (
					<div
						key={post._id}
						className='w-full h-full rounded-xl shadow-md overflow-hidden border-4 border-blue-200 bg-blue-100'>
						<img
							src={post.image?.url || Profile}
							alt='post'
							className='w-full h-auto'
						/>
						<div className='p-4 flex flex-col gap-4 items-start justify-between'>
							<div className='flex justify-between w-full'>
								<div className='text-gray-800 font-semibold text-lg cursor-pointer hover:text-blue-500 transition'>
									{post.userId ? (
										<div>{post.userId?.username}</div>
									) : (
										<div>Unknown</div>
									)}
								</div>
								<div className='relative'>
									<div
										onClick={() =>
											setIsOpenModal(
												isOpenModal === post._id ? null : post._id
											)
										}
										className='p-1 hover:bg-gray-100 rounded-full bg-gray-200 cursor-pointer transition'>
										<IoMdMore size={30} />
									</div>
									{isOpenModal === post._id && (
										<div className='absolute text-center right-0 mt-1 w-40 h-full bg-white z-50'>
											<button
												onClick={() => handleDeletePost(post._id)}
												className={modalContent}>
												<RxCross2 color='red' size={25} /> Delete
											</button>
											<button
												className={modalContent}
												onClick={() => handleEditPost(post)}>
												<CiEdit size={25} /> Edit
											</button>
										</div>
									)}
								</div>
							</div>
							{editingPost === post._id ? (
								<>
									<textarea
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										className='border p-2 rounded w-full'
									/>
									<div className='flex'>
										{' '}
										<button
											className='flex items-center gap-2 px-4 py-2 text-gray-700 font-semibold hover:bg-blue-200 cursor-pointer transition'
											onClick={() => handleSave(post._id)}>
											<IoSaveOutline size={25} />
											Save
										</button>
										<button
											className='flex items-center'
											onClick={() => setEditingPost(null)}>
											<RxCross2 size={25} color='red' />
											Cancel
										</button>
									</div>
								</>
							) : (
								<div className='text-gray-800'>
									{post.description}
								</div>
							)}
							<div className='flex gap-6 items-center'>
								<button className='flex items-center gap-1 text-gray-600 hover:text-red-500 transition'>
									<FaRegHeart size={24} />
									<span>{post.likes?.length || 0}</span>
								</button>
								<button className='flex items-center gap-1 text-gray-600 hover:text-blue-500 transition'>
									<FaRegComment size={24} />
									<span>{post.comments?.length || 0}</span>
								</button>
							</div>
						</div>
					</div>
				))}
		</div>
	);
};

export default PostCard;
