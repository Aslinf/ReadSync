import { Header } from "./home";
import { useAuth } from "../components/AuthContext";

function Profile() {
	const { user } = useAuth();
	return(
		<>
			<Header/>
			<div>
				<p>Hola {user}</p>
				<p>ALOOOOOOOOOOO</p>
			</div>
		</>
	)
}

export default Profile;