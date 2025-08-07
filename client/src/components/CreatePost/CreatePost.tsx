import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useUser } from '../../hooks/useUser';
import api from '../../services/axios';
import type {
	CreatePostData,
	CreatePostProps,
} from '../../types/Post';

const CreatePost = ({ setIsOpenModal }: CreatePostProps) => {
	const [description, setDescription] = useState<string>('');
	const [image, setImage] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');
	const { user } = useUser();
	const [preview, setPreview] = useState<string | null>(null);

	const resetForm = () => {
		setImage(null);
		setPreview(null);
		setDescription('');
		setIsOpenModal(false);
	};

	const handleImageChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result as string);
				setPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		if (!user?._id) {
			toast.error('No User Found!');
			return;
		}
		setLoading(true);
		setError('');

		const postData: CreatePostData = {
			userId: user._id,
			description,
			...(image && { image }),
		};
		try {
			await api.post('/posts/create-post', postData);
			toast.success('Post successfully created!');
			resetForm();
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || err.message);
				toast.error(err.response?.data?.message || err.message);
			} else {
				setError('Failed to create post');
				toast.error('Failed to create post');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='max-w-2xl mx-auto px-4 py-6'>
			<h1 className='text-3xl font-bold mb-6 text-center text-blue-500'>
				Create New Post
			</h1>
			<form
				onSubmit={handleSubmit}
				className='bg-white p-6 rounded-xl shadow-md space-y-4'>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					rows={4}
					className='w-full border border-gray-300 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300'
					placeholder='Write your post description...'
				/>

				<input
					type='file'
					accept='image/*'
					onChange={handleImageChange}
					className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0 file:text-sm file:font-semibold
                    file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200'
				/>
				{preview && (
					<img
						src={preview}
						alt='Preview'
						className='rounded-xl max-h-64 object-cover mx-auto'
					/>
				)}
				<button
					type='submit'
					disabled={loading}
					className='w-full bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold py-3 rounded-xl transition duration-200'>
					{loading ? 'Posting...' : 'Post'}
				</button>
			</form>
		</div>
	);
};

export default CreatePost;
