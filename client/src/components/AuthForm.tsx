import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../services/axios';
import { toast } from 'react-toastify';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';
import { useUser } from '../hooks/useUser';

interface AuthFormProps {
	type: 'login' | 'register';
}
interface FormData {
	username: string;
	password: string;
	email?: string;
}

const AuthForm = ({ type }: AuthFormProps) => {
	const [formData, setFormData] = useState<FormData>({
		username: '',
		password: '',
		email: '',
	});
	const [loadingForm, setLoadingForm] = useState<boolean>(false);
	const [error, setError] = useState<null | string>(null);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const { login } = useUser();
	const navigate = useNavigate();
	const isRegister = type === 'register';
	const inputStyle =
		'w-full px-4 py-2 border bg-white text-black border-amber-500 rounded focus:outline-none focus:ring-2 focus:ring-amber-700';

	const handleChangeInput = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	//submit login/register form
	const handleSubmitForm = async (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!formData.username ||
			!formData.password ||
			(isRegister && !formData.email)
		) {
			setError('All fields are required!');
			return;
		}
		setLoadingForm(true);
		setError(null);
		try {
			const endpoint = isRegister ? '/auth/register' : '/auth/login';
			const payload = isRegister
				? formData
				: {
						username: formData.username,
						password: formData.password,
				  };
			const userRes = await api.post(endpoint, payload);
			const { details, isAdmin } = userRes.data;
			toast.success(
				`${isRegister ? 'Registration' : 'Login'} successful!`
			);
			if (isRegister) {
				navigate('/login');
			} else {
				login({ ...details, isAdmin });
				navigate('/');
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const message =
					error.response?.data?.message || error.message;
				setError(message);
				toast.error(message);
			}
		} finally {
			setLoadingForm(false);
		}
	};
	return (
		<div className='flex justify-center items-center w-screen h-screen p-4'>
			<div className='w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-amber-200 flex flex-col border-4 justify-center border-amber-700 rounded-xl p-6'>
				{type === 'login' ? (
					<Link
						to='/register'
						className='flex justify-end mb-4 mr-4 text-md underline text-amber-900'>
						Need an account? Register now.
					</Link>
				) : (
					<Link
						to='/login'
						className='flex justify-end mb-4 mr-4 text-md underline text-amber-900'>
						Already have an account? Login here.
					</Link>
				)}
				<h2 className='text-2xl font-bold text-center text-amber-700 mt-4'>
					{type === 'login' ? 'Login' : 'Register'}
				</h2>
				<form
					onSubmit={handleSubmitForm}
					className='flex flex-col gap-4 items-center'>
					{isRegister && (
						<div className='flex flex-col w-full sm:w-3/4 md:w-2/3'>
							<label className='font-semibold text-amber-700'>
								Email
							</label>
							<input
								type='email'
								name='email'
								value={formData.email}
								onChange={handleChangeInput}
								className={inputStyle}
								required
							/>
						</div>
					)}
					<div className='flex flex-col w-full sm:w-3/4 md:w-2/3'>
						<label className='font-semibold text-amber-700'>
							Username
						</label>
						<input
							type='text'
							name='username'
							value={formData.username}
							onChange={handleChangeInput}
							className={inputStyle}
							required
						/>
					</div>
					<div className='flex flex-col w-full sm:w-3/4 md:w-2/3 relative'>
						<label className='font-semibold text-amber-700'>
							Password
						</label>
						<input
							type={showPassword ? 'text' : 'password'}
							name='password'
							value={formData.password}
							onChange={handleChangeInput}
							className={inputStyle}
							required
						/>
						<span
							className='text-amber-800 cursor-pointer absolute top-7 right-2'
							onClick={() => setShowPassword((prev) => !prev)}>
							{showPassword ? (
								<FaEyeSlash size={30} />
							) : (
								<FaEye size={30} />
							)}
						</span>
					</div>
					{error && (
						<p className='text-red-600 text-sm mt-1'>{error}</p>
					)}
					<button
						disabled={loadingForm}
						type='submit'
						className='bg-amber-800 text-white font-bold w-[300px]  py-2 mt-4 rounded hover:bg-amber-900 flex justify-center items-center'>
						{loadingForm ? (
							<ClipLoader color='#FFBF00' size={30} />
						) : type === 'login' ? (
							'Login'
						) : (
							'Register'
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default AuthForm;
