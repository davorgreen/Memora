import { RxCross2 } from 'react-icons/rx';

interface Friend {
	_id: string;
	username: string;
}

interface FriendModalProps {
	friends: Friend[];
	isOpen: boolean;
	onClose: () => void;
	canRemove?: boolean;
	removeFriend?: (id: string) => void;
	title?: string;
}

const FriendModal = ({
	friends,
	isOpen,
	onClose,
	canRemove = false,
	removeFriend,
	title,
}: FriendModalProps) => {
	if (!isOpen) return null;

	return (
		<div className='mt-2 w-64 bg-blue-200 p-4 rounded-2xl shadow-lg flex flex-col gap-4'>
			<div className='flex justify-end'>
				<button
					onClick={onClose}
					className='p-1 rounded-2xl hover:bg-gray-200 transition'>
					<RxCross2 size={20} />
				</button>
			</div>
			<h3 className='text-center font-semibold'>{title}</h3>
			{friends.length === 0 && (
				<p className='text-sm text-gray-400 text-center'>
					No friends yet
				</p>
			)}
			{friends.map((fr) => (
				<div
					key={fr._id}
					className='flex justify-between items-center border-b border-gray-100 pb-2'>
					<p className='text-gray-800 font-medium'>{fr.username}</p>
					{canRemove && removeFriend && (
						<button
							onClick={() => removeFriend(fr._id)}
							className='text-sm w-20 h-10 rounded-xl text-white font-semibold bg-red-500 hover:bg-red-700 transition'>
							Remove
						</button>
					)}
				</div>
			))}
		</div>
	);
};

export default FriendModal;
