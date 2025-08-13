import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import UserProvider from './context/UserProvider.tsx';
import FriendsProvider from './context/FriendsProvider.tsx';
import PostsProvider from './context/PostsProvider.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<UserProvider>
			<FriendsProvider>
				<PostsProvider>
					<App />
				</PostsProvider>
			</FriendsProvider>
		</UserProvider>
	</StrictMode>
);
