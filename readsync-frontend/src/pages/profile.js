import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import MsgPopup from "../components/MsgPopup";
import "../stylesheets/profile.css";
import { Loader } from "./home";
import BookRatings from "../components/statistics/BookRatings";
import Carrousel from "../components/Carrousel";

function Profile() {
	const { user, logout, isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const collectionsData = []
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [deletePopup, setDeletePopup] = useState(false);
	const [collectionData, setCollectionData] = useState([]);
	const [bookRatingsData, setBookRatingsData] = useState([]);
	const [deletButtonVisivility, setDeleteButtonVisivility] = useState(true);

	const getCorrectData = (data) => {
		data.forEach(obj => {
			collectionsData.push(obj.nombre)
		});
		console.log(collectionsData);
	}

	const deleteProfile = async (id, type) => {
		try {
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

	const fetchURL = "http://localhost:80/readsync/backend/getCollections.php";
	const getBookRatingsEndpoint = "http://localhost:80/readsync/backend/statistics/getBookRating.php";
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(fetchURL, {
					method: 'POST',
					headers: {
							'Content-Type': 'application/json'
					},
					body: JSON.stringify({ user: user })
				});
				const json = await response.json();
				if (json[0].result !== "Falta información de usuario") {
						setCollectionData(json);
				} else {
						setCollectionData([]);
						setError(json[0].result);
				}

				const response2 = await fetch(getBookRatingsEndpoint, {
					method: 'POST',
					mode: "cors",
          headers: {
						"Accept": "application/json",
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user: user })
				});
				if (!response2.ok) {
					throw new Error('Failed to fetch ratings from backend');
				}
				const bookRatings = await response2.json();
				setBookRatingsData(bookRatings);

			} catch (err) {
					setError(err.message);
			} finally {
					setLoading(false);
			}
		}
		fetchData();
	}, [user, fetchURL])

	if(collectionData.length > 0){
		getCorrectData(collectionData[0].result)
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
		{loading ? (<Loader />)
			:<section id="profile-section">
				{error && <MsgPopup error={error} setError={setError}/>}
				<h2>{user}</h2>

				<div className="reading-goal">
					Reading Goal
				</div>

				{collectionData.length > 0 && collectionData[0]?.result !== `Ninguna colección de ${user}` ? 
						(<Carrousel 
							data={collectionsData} 
							title={"Colecciones"}
						/>)
						
				 : (<div className="noInfo">No hay colecciones</div>)}
				

				<BookRatings bookRatingsData={bookRatingsData}/>

				<button className={deletButtonVisivility ? "delete-user-button" : "hide"} onClick={() => {setDeletePopup(!deletePopup); setDeleteButtonVisivility(!deletButtonVisivility)}}>
					Borrar cuenta
				</button>

				{deletePopup ? <div className="center">
					<p>¿Estas seguro que quieres eliminar tu cuenta?</p>
					<div>
						<button onClick={() => handleDeleteProfile()}>Borrar</button>
						<button onClick={() =>{setDeletePopup(!deletePopup); setDeleteButtonVisivility(!deletButtonVisivility)}}>Cerrar</button>
					</div>
				</div> : ''}

			</section>}
		</>
	)
}

export default Profile;