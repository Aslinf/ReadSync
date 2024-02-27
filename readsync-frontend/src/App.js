import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/home";
import Signin_up from "./pages/signin-up";
import Book from './pages/book';
import Search from './pages/search';
import Profile from './pages/profile';
import Library from './pages/library';
import CollectionBooks from './components/collectionBooks';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/signin-up' element={<Signin_up />} />
      <Route path='/perfil' element={<Profile/>} />
      <Route path='/libro/:bookId' element={<Book />} />
      <Route path='/busqueda/:book' element={<Search />} />
      <Route path='/biblioteca' element={<Library/>} >
        <Route path=':collection' element={<CollectionBooks />} />
      </Route>
      {/*<Route path="*" element={<NoMatch />} />*/}
    </Routes>
  );
}

export default App;
