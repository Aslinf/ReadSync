import '../stylesheets/sign-in.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';


function SignIn(){

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  //const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { signin, token } = useAuth();


  const handleInputChange = (e, type) => {
    switch(type){
      case "user":
        setError("");
        setUser(e.target.value);
        if(e.target.value === ""){
          setError("¡El campo usuario no puede estar vacío!")
        }
        break;

      case "password":
        setError("");
        setPassword(e.target.value);
        if(e.target.value === ""){
          setError("¡El campo contraseña no puede estar vacío!")
        }
        break;

      }
    }

  function handleSignin() {
    if (user !== "" && password !== "") {
      const url = "http://localhost:80/readsync/backend/sign_in.php"; 
      
      var headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
      };
  
      var Data = {
        user: user,
        password: password
      };
  
      fetch(url, {
        method: "POST",
        mode: "cors",
        headers: headers,
        body: JSON.stringify(Data)
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
      // Mirar si el inicio de sesión ha sido correcto
      if (res[0].result === "Inicio de sesión exitoso") {
        // Enviamos al usuario a /Home
        setMsg(res[0].result);
        //setToken(res[0].token);
        signin(res[0]);
        navigate('/');
      } else {
        // Error al iniciar sesión
        setError(res[0].result);
      }
      })
      .catch((err) => {
        setError(err.message);
        console.error(err);
      });
  
    } else {
      setError("¡Se deben rellenar todos los campos!");
    }
  }


  
  return(
    <>
    <h2>Inicia Sesión</h2>
    <p>
      {msg !== "" ? <span className='success'>{msg}</span> : <span className='error'>{error}</span>}
    </p>

    <label>Usuario
    <input 
    type="text"
    name="usuario"
    value={user}
    onChange={(e)=> handleInputChange(e, "user")}
    />
    </label>

    <label>Contraseña
    <input 
    type="password"
    name="password"
    value={password}
    onChange={(e)=> handleInputChange(e, "password")}
    />
    </label>

    <input 
    type="submit"
    defaultValue="submit"
    className='button'
    onClick={handleSignin}
    />

    
    </>
  )
}

export default SignIn;