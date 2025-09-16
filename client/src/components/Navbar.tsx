import { MdOutlinePhotoCamera } from 'react-icons/md';
import { FaRegBell } from 'react-icons/fa';
import { TbMessages } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { useEffect, useState } from 'react';
import type { Message } from '../types/User';
import type { Notification } from '../types/Post';
import socket from '../services/socket';
import api from '../services/axios';
import axios from 'axios';

const Navbar = () => {
	const navigate = useNavigate();
	const { logout, errorUser, loadingUser, user } = useUser();
	const [notifications, setNotifications] = useState<string[]>([]);
	const [messages, setMessages] = useState<Message[]>([]);
	const [showNotifications, setShowNotifications] =
		useState<boolean>(false);
	const [showChat, setShowChat] = useState<boolean>(false);
	const [errorNotifications, setErrorNotifications] = useState<
		string | null
	>(null);

	useEffect(() => {
		const handleConnect = () => {
			if (user?._id) {
				socket.emit('register', user._id);
				console.log('User re-registered:', user._id);
			}
		};

		socket.on('connect', handleConnect);

		socket.on('like-notification', (data) => {
			setNotifications((prev) => [...prev, data.message]);
		});

		socket.on('receive-message', (data) => {
			setMessages((prev) => [
				...prev,
				{ from: data.fromUserId, text: data.text },
			]);
		});

		const fetchNotifications = async () => {
			if (!user?._id) return;
			try {
				const res = await api.get(`/notifications/${user._id}`);
				const data = await res.data;
				if (data.length > 0) {
					setNotifications((prev) => [
						...prev,
						...data.map((n: Notification) => n.message),
					]);
				}
			} catch (err) {
				if (axios.isAxiosError(err)) {
					const message = err.response?.data?.message || err.message;
					setErrorNotifications(message);
					toast.error(message);
				}
			}
		};

		fetchNotifications();

		return () => {
			socket.off('connect', handleConnect);
			socket.off('like-notification');
			socket.off('receive-message');
		};
	}, [user?._id]);

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

	if (errorNotifications)
		return (
			<p className='font-bold text-2xl text-red-600'>
				Error: {errorNotifications}
			</p>
		);

	const handleLogout = () => {
		if (socket && user?._id) {
			socket.emit('logout', user._id);
		}
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
				<button
					className='relative'
					onClick={() => setShowNotifications(!showNotifications)}>
					<FaRegBell size={40} />
					{notifications.length > 0 && (
						<span className='absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full'>
							{notifications.length}
						</span>
					)}
				</button>
				{showNotifications && (
					<div className='absolute top-12 right-0 w-80 bg-white shadow-lg rounded-md p-4 z-20'>
						<h3 className='font-bold mb-2'>Notifications</h3>
						<ul>
							{notifications.map((n, i) => (
								<li key={i} className='border-b py-1'>
									{n}
								</li>
							))}
						</ul>
					</div>
				)}
				<button
					className='relative'
					onClick={() => setShowChat(!showChat)}>
					<TbMessages size={45} />
					{messages.length > 0 && (
						<span className='absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full'>
							{messages.length}
						</span>
					)}
				</button>
				{showChat && (
					<div className='absolute top-12 right-0 w-96 bg-white shadow-lg rounded-md p-4 z-20'>
						<h3 className='font-bold mb-2'>Chat</h3>
						<ul>
							{messages.map((m, i) => (
								<li key={i} className='border-b py-1'>
									<b>{m.from}:</b> {m.text}
								</li>
							))}
						</ul>
						{/*REPLY FAST */}
					</div>
				)}
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
