import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {

    const url = "https://readsync.uabcilab.cat/backend/logout.php";

    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((res) => {
      logout(); 
      navigate('/'); 
    })
    .catch((err) => {
      console.error(err);
    });
  };

  return (

    <a onClick={handleLogout}>Cerrar Sesión</a>

  );
}

export default Logout;
