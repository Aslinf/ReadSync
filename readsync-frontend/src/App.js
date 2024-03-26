import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/home";
import SigninUp from "./pages/signin-up";
import Book from './pages/book';
import Search from './pages/search';
import Profile from './pages/profile';
import Library from './pages/library';
import CollectionBooks from './components/ShowBooksInCollection';
import NoMatch from './components/RouteError';
import Statistics from './pages/statistics';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} >
        <Route path='/perfil' element={<Profile/>} />
        <Route path='/libro/:bookId' element={<Book />} />
        <Route path='/busqueda/:book' element={<Search />} />
        <Route path='/biblioteca' element={<Library/> } />
        <Route path='/biblioteca/:collection' element={<CollectionBooks />} />
        <Route path='/estadisticas' element={<PrivateRoute> <Statistics /> </PrivateRoute>} />
        <Route path="*" element={<NoMatch />} />
      </Route>   
      <Route path='/sesion' element={<SigninUp />} />
    </Routes>
  );
}

export default App;
