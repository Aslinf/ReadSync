import '../stylesheets/signin-up.css';
import SignUp from '../components/sign-up';
import SignIn from '../components/sign-in';
import { useState } from 'react';

function SigninUp() {

  const [showComponent, setShowComponent] = useState(true);
  const [showComponent2, setShowComponent2] = useState(true);

  //logica para cambiar entre componentes
  const toggleComponent = () => {
    setShowComponent(!showComponent);
    setShowComponent2(!showComponent2);
  };

  return (
    <>
      <div className='signin-up'>
        <div className='form'>
        {showComponent ? <SignUp /> : <SignIn />}
        {showComponent2 
          ? <p>Si ya tienes una cuenta <span onClick={toggleComponent}>Inicia sesión</span></p>
        : <p>Si aún no tienes cuenta <span onClick={toggleComponent}>Registrate</span></p>}
        
        </div>
      </div>
    </>
  );
}

export default SigninUp;
