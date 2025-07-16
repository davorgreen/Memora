import { useState } from 'react';
import api from '../services/axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

interface LoginForm {
	username: string;
	password: string;
}

const Login = () => {
	const [formData, setFormData] = useState<LoginForm>({
		username: '',
		password: '',
	});
	const [loadingForm, setLoadingForm] = useState<boolean>(false);
	const [error, setError] = useState<null | string>(null);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const inputStyle =
		'w-full px-4 py-2 border bg-white text-black border-amber-500 rounded focus:outline-none focus:ring-2 focus:ring-amber-700';

	const handleChangeInput = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
		console.log(formData);
	};

	const handleSubmitLoginForm = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.username || !formData.password) {
			setError('All fields are required!');
			return;
		}
		setLoadingForm(true);
		try {
			await api.post('/auth/login', formData);
			toast.success('Login successful!');
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
		<div className='flex justify-center items-center w-screen h-screen'>
			<div className='w-[80%] max-w-[500px] h-[70%] bg-amber-200 flex flex-col border-4 justify-center border-amber-700 rounded-xl'>
				<h2 className='text-2xl font-bold text-center text-amber-700 mt-4'>
					Login
				</h2>
				<form
					onSubmit={handleSubmitLoginForm}
					className='flex flex-col gap-4 items-center'>
					<div className='flex flex-col w-[70%]'>
						<label className='font-semibold text-amber-700'>
							Username
						</label>
						<input
							type='text'
							name='username'
							value={formData.username}
							onChange={handleChangeInput}
							required
							className={inputStyle}
						/>
					</div>
					<div className='flex flex-col w-[70%] relative'>
						<label className='font-semibold text-amber-700'>
							Password
						</label>
						<input
							type={showPassword ? 'text' : 'password'}
							name='password'
							value={formData.password}
							onChange={handleChangeInput}
							required
							className={inputStyle}
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
						type='submit'
						className='bg-amber-800 text-white font-bold px-10 py-2 mt-4 rounded hover:bg-amber-900 transition duration-200'>
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
