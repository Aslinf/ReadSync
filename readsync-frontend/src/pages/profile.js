import { useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import MsgPopup from "../components/MsgPopup";

function Profile() {
	const { user, logout, isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const [deletePopup, setDeletePopup] = useState(false);
	console.log(user);

	console.log(isAuthenticated);
	const deleteProfile = async (id, type) => {
		try {
			console.log(user);
			const response = await fetch('http://localhost:80/readsync/backend/deleteData.php', {
				method: 'POST',
				headers: {
						'Content-Type': 'application/json'
				},
				body: JSON.stringify({ 
					id: user, 
					type: type
				})
		});

		logout(); 
    navigate('/sesion'); 

		} catch (err) {
			setError(err.message);
		}
	}

	const handleDeleteProfile = async (user) => {
		setDeletePopup(false);
		try {
				await deleteProfile(user, 'profile'); 
		} catch (err) {
				setError(err.message);
		}
};

	return(
		<>
			<div>
				{error && <MsgPopup error={error} setError={setError}/>}
				<p>Hola {user}</p>
				<p>ALOOOOOOOOOOO</p>
				{deletePopup ? <div>
					<p>¿Estas seguro que quieres eliminar tu cuenta?</p>
					<button onClick={() => handleDeleteProfile()}>Borrar</button>
					<button onClick={() => setDeletePopup(!deletePopup)}>Cerrar</button>
				</div> : ''}

				<button onClick={() => setDeletePopup(!deletePopup)}>
					Borrar cuenta
				</button>
			</div>
		</>
	)
}

export default Profile;