import '../stylesheets/home.css'
import { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import Logout from '../components/Logout';

const Header = () => {
  const { isAuthenticated, setIsAuthenticated, user, token } = useAuth();
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    }
  }, [token, setIsAuthenticated]);

  const handleChange = (e) => {
    setBusqueda(e.target.value);
    if(e.target.value === ""){
      setBusqueda("error");
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      navigate(`/busqueda/${busqueda}`);
    }
  }
 
  return(
    <>
       <header className='home-header'>
        <Link to={"/"} className='home-page-button'>
          <h1>ReadSync</h1>
        </Link>

        <div>
          <input type='text' placeholder='Buscar algún libro' className='search-bar' onChange={handleChange} onKeyPress={handleKeyPress}/>
          <Link to={`/busqueda/${busqueda}`} className='search-button'>Buscar</Link>
        </div>
        

        {isAuthenticated ? (
          <div className='menu'>
            <button className='menu-button'>¡Hola {user}!</button>
            <div className="dropdown-menu">
              <ul>
                <li><Link to={"/perfil"}>Perfil</Link></li>
                <li><Link to={"/biblioteca"}>Biblioteca</Link></li>
                <li><Link to={"/estadisticas"}>Estadísticas</Link></li>
                <li><Logout/></li>
              </ul>
            </div>
          </div>

        ) : (
          <Link to="/sesion" className='button-signup'>Registrate</Link>
        ) }

      </header>
    </>
  )

}

  function Loader() {
    return(
      <div className='loader-container'>
        <p className="loader"></p>
      </div>
    )
  }


function Home() {

	return(
		<>
    <div className='home'>

      <Header/>

      <div className='home-container'>

        <Outlet />

      </div>

      <footer>
        
      </footer>

    </div>  
		</>
	)
}


export default Home;
export {Header, Loader};
