import '../stylesheets/sign-up.css';
import { useState, useEffect } from 'react';

function SignUp(){

  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setTimeout(function(){
      setMsg("");
    }, 15000);
  }, [msg]);

  //mirar si los campos estan vacios y si la contraseña en correcta
  const handleInputChange = (e, type) => {
    switch(type){
      case "user":
        setError("");
        setUser(e.target.value);
        if(e.target.value === ""){
          setError("¡El campo usuario no puede estar vacío!")
        }
        break;

      case "email":
        setError("");
        setEmail(e.target.value);
        if(e.target.value === ""){
          setError("¡El campo email no puede estar vacío!")
        }
        break;

      case "password":
        setError("");
        setPassword(e.target.value);
        if(e.target.value === ""){
          setError("¡El campo contraseña no puede estar vacío!")
        }
        break;

      case "password2":
          setError("");
          setPassword2(e.target.value);
          if(e.target.value === ""){
            setError("¡Se debe repetir la contraseña!")
          } else if(e.target.value !== password){
            setError("¡Las contraseñas no son iguales!")
          } 
          break;
    }
  }

  //comporbamos que la contraseña...
  function checkPassword(){
    if(password.length < 8){
      setError("La contraseña debe tener como mínimo 8 caracteres")
    }
  }

  //enviamos los datos al backend
  function handleSubmit(){
    if(user !== "" && email !== "" && password !== "" && password2 !== ""){
      const url = "http://localhost:80/readsync/backend/signup.php";
      var headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
      };

      var Data = {
        user: user,
        email: email,
        password: password
      }

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
        setMsg(res[0].result);
      }).catch((err) =>{
        setError(err.message);
        console.error(err);
      });

      setUser("");
      setEmail("");
      setPassword("");
      setPassword2("");

    }else {
      setError("¡Se deben rellenar todos los campos!");
    }
  }

  //miramos si el usuario ya existe
  function checkUser(){
    
    const url = "http://localhost:80/readsync/backend/checkuser.php";
    var headers = {
      "Accept": "application/json",
      "Content-Type": "application/json"
    };

    var Data = {
      user: user,
    }

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
      setError(res[0].result);
    }).catch((err) =>{
      setError(err.message);
      console.error(err);
    });
  }

  //en caso que se haya rellenado mal el formulario
  function handleError(){
    setError("El formulario es incorrecto");
  }

  return(
    <>
      <h2>Registrate</h2>
        <p>
          {msg !== "" ? <span className='success'>{msg}</span> : <span className='error'>{error}</span>}
        </p>
        <label>Usuario
        <input 
        type="text"
        name="usuario"
        value={user}
        onChange={(e)=> handleInputChange(e, "user")}
        onBlur={checkUser}
        />
        </label>

        <label>Email
        <input 
        type="email"
        name="email"
        value={email}
        onChange={(e)=> handleInputChange(e, "email")}
        />
        </label>

        <label>Contraseña
        <input 
        type="password"
        name="password"
        value={password}
        onChange={(e)=> handleInputChange(e, "password")}
        onBlur={checkPassword}
        />
        </label>

        <label>Confirmar Contraseña
        <input 
        type="password"
        name="password2"
        value={password2}
        onChange={(e)=> handleInputChange(e, "password2")}
        />
        </label>

        <input 
        type="submit"
        defaultValue="submit"
        className='button'
        onClick={error !== "" ? handleError : handleSubmit}
        />
      
    </>
  );
}

export default SignUp;