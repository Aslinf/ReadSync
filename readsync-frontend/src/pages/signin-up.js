import '../stylesheets/signin-up.css';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

function SigninUp() {
  
  const { id } = useParams();
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");


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

  return (
    <>
      <div className='signin-up'>
        <div className='form'>
          
        {id === 'registro' && 
          <SignUp 
            handleInputChange={handleInputChange} 
            user={user}
            email={email}
            password={password}
            password2={password2}
            error={error}
            setError={setError}
          />}
        {id === 'iniciar' && 
          <SignIn 
            handleInputChange={handleInputChange} 
            user={user}
            password={password}
            error={error}
            setError={setError}
          />}
        
        </div>
      </div>
    </>
  );
}

export default SigninUp;
