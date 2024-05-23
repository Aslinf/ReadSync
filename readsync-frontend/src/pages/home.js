import '../stylesheets/home.css'
import { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import Logout from '../components/Logout';

const Header = () => {
  const { isAuthenticated, setIsAuthenticated, user, token } = useAuth();
  const [busqueda, setBusqueda] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    }
  }, [token, setIsAuthenticated]);

  //guardar la busqueda del usuario
  const handleChange = (e) => {
    setBusqueda(e.target.value);
    if(e.target.value === ""){
      setBusqueda("error");
    }
  }

  //hacer busqueda en enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate(`/busqueda/${busqueda}`);
    }
  }

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
 
  return(
    <>
       <header className='home-header'>
        <Link to={"/"} className='home-page-button'>
          <h1>ReadSync</h1>
        </Link>

        <div className='search-items'>
          <input type='text' placeholder='Buscar algún libro' className='search-bar' onChange={handleChange} onKeyDown={handleKeyDown}/>
          <Link to={`/busqueda/${busqueda}`} className='search-button'>Buscar</Link>
        </div>

        {/* Mobile menu */}
        {isAuthenticated? 
          <div className={`menu-mobile ${showMenu ? 'show' : ''}`}>
          <button className='menu-button-mobile' onClick={toggleMenu}>☰</button>
          <div className="dropdown-menu mobile-menu">
            <ul>
              <li><Link to={"/perfil"} onClick={toggleMenu}>Perfil</Link></li>
              <li><Link to={"/biblioteca"} onClick={toggleMenu}>Biblioteca</Link></li>
              <li><Link to={"/estadisticas"} onClick={toggleMenu}>Estadísticas</Link></li>
              <li><Logout /></li>
            </ul>
          </div>
        </div>
        : ""}

        {/* Desktop menu */}
        {isAuthenticated ? (
          <div className='menu-desktop'>
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
          <div style={{display: "flex", columnGap:"10px"}}>
            <Link to="/sesion/registro" className='button-signup'>Registrate</Link>
            <Link to="/sesion/iniciar" className='button-signup'>Iniciar sesión</Link>
          </div>
          
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

  const location = useLocation();

	return(
		<>
    <div className='home'>

      <Header/>

      <div className={location.pathname === '/' ? "home-container" : "home-container-simple"}>

        <Outlet />

      </div>

    </div>  
		</>
	)
}


export default Home;
export {Header, Loader};
