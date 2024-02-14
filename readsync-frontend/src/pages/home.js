import '../stylesheets/home.css'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import Logout from '../components/log-out';

const Header = () => {
  const { isAuthenticated, setIsAuthenticated, user, token } = useAuth();
  const [busqueda, setBusqueda] = useState("");

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
 
  return(
    <>
       <header className='home-header'>
        <Link to={"/"} className='home-page-button'>
          <h1>ReadSync</h1>
        </Link>

        <div>
          <input type='text' placeholder='Buscar algún libro' className='search-bar' onChange={handleChange}/>
          <Link to={`/busqueda/${busqueda}`} className='search-button'>Buscar</Link>
        </div>
        

        {isAuthenticated ? (
          <div className='menu'>
            <button className='menu-button'>¡Hola {user}!</button>
            <div className="dropdown-menu">
              <ul>
                <Link to={"/perfil"}>Perfil</Link>
                <li>Biblioteca</li>
                <li>Estadísticas</li>
                <li><Logout/></li>
              </ul>
            </div>
          </div>

        ) : (
          <Link to="/signin-up" className='button-signup'>Registrate</Link>
        ) }

      </header>
    </>
  )

}

function Home() {
  const [data, setData] = useState([]);
  const [error, setError]= useState(null);
  const api = 'http://openlibrary.org/subjects/love.json?limit=3';

  useEffect(() => {
    const getData = async () => {
      try{
        const response = await fetch(api);
        const json = await response.json();
        setData(json);
      } catch(err) {
        setError(err.message);
      } finally {

      }
    }
    getData();
  }, [api]);



	return(
		<>
    <div className='home'>

      <Header/>

      <div className='first-home-container'>

      </div>



      <footer>
        
      </footer>

    </div>  
		</>
	)
}

/*
      <div className='carousel-home'>
          <h3>Romance</h3>
          <div className='carousel-books'>
            {data && data.works?.map((data) => (
              <Link 
              key={data.key}
              to={`${data.key}`}
              className='carousel-book'>
                
                  <span>{data.title}</span>
                  <img alt='portada de libro' src={`https://covers.openlibrary.org/b/id/${data.cover_id}-M.jpg`}/>
              </Link> 
            ))}
          </div>
      </div>
      */

export default Home;
export {Header};