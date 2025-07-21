import { ToastContainer } from 'react-toastify';
import Login from './pages/Login';
import Register from './pages/Register';
import {
	BrowserRouter as Router,
	Routes,
	Route,
} from 'react-router-dom';
import Home from './pages/Home';

function App() {
	return (
		<Router>
			<ToastContainer position='top-center' autoClose={3000} />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />
			</Routes>
		</Router>
	);
}

export default App;
