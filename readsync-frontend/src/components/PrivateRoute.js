import { Loader } from "../pages/home";
import { useAuth } from "./AuthContext";
import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children }){
    
    const { isAuthenticated } = useAuth();
    //let location = useLocation();

   
        if(!isAuthenticated){
            return <Navigate to="/sesion"/>
        }
        return children;
   

}

export default PrivateRoute;