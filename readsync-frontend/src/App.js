import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/home";
import Signin_up from "./pages/signin-up";
import Book from './components/book';
import Search from './pages/search';
import Profile from './pages/profile';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/signin-up' element={<Signin_up />} />
      <Route path='/perfil' element={<Profile/>} />
      <Route path='/libro/:bookId' element={<Book />} />
      <Route path='/busqueda/:book' element={<Search />} />
    </Routes>
  );
}

export default App;
