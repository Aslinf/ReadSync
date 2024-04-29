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
        <Route path='/perfil' element={<PrivateRoute> <Profile/> </PrivateRoute>} />
        <Route path='/libro/:bookId' element={<Book />} />
        <Route path='/busqueda/:book' element={<Search />} />
        <Route path='/biblioteca' element={<PrivateRoute> <Library/> </PrivateRoute> } />
        <Route path='/biblioteca/:collection' element={<PrivateRoute> <CollectionBooks /> </PrivateRoute>} />
        <Route path='/estadisticas' element={<PrivateRoute> <Statistics /> </PrivateRoute>} />
        <Route path="*" element={<NoMatch />} />
      </Route>   
      <Route path='/sesion/:id' element={<SigninUp />} />
    </Routes>
  );
}

export default App;
