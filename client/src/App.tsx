import {
	BrowserRouter as Router,
	Routes,
	Route,
} from 'react-router-dom';
import useAxiosInterceptors from './hooks/useAxiosInterceptors';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { ToastContainer } from 'react-toastify';

function App() {
	return (
		<>
			<ToastContainer position='top-center' autoClose={3000} />
			<Router>
				<AxiosInterceptorWrapper>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/login' element={<Login />} />
						<Route path='/register' element={<Register />} />
					</Routes>
				</AxiosInterceptorWrapper>
			</Router>
		</>
	);
}

function AxiosInterceptorWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	useAxiosInterceptors();
	return <>{children}</>;
}

export default App;
