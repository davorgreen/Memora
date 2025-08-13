import { MdOutlinePhotoCamera } from 'react-icons/md';
import { FaRegBell } from 'react-icons/fa';
import { TbMessages } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

const Navbar = () => {
	const navigate = useNavigate();
	const { logout, errorUser, loadingUser } = useUser();

	if (loadingUser) {
		return (
			<div className='flex justify-center items-center h-64'>
				<ClipLoader color='#229ac5' size={50} />
			</div>
		);
	}

	if (errorUser)
		return (
			<p className='font-bold text-2xl text-red-600'>
				Error: {errorUser}
			</p>
		);

	const handleLogout = () => {
		logout();
		toast.success('Logout successful!');
		navigate('/login');
	};
	return (
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
				<button
					onClick={handleLogout}
					className='bg-red-400 font-bold text-white text-xl rounded-xl w-40'>
					Logout
				</button>
			</div>
		</header>
	);
};

export default Navbar;
