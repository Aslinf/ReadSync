import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import MsgPopup from "../components/MsgPopup";
import "../stylesheets/profile.css";
import { Loader } from "./home";
import BookRatings from "../components/statistics/BookRatings";
import Carrousel from "../components/Carrousel";
import ReadingGoalForm from "../components/ReadingGoal";
import { ReadingGoal } from "../components/ReadingGoal";
import deleteData from "../pages/library";

function Profile() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [collectionsData, setCollectionsData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [deletePopup, setDeletePopup] = useState(false);
	const [bookRatingsData, setBookRatingsData] = useState([]);
	const [deletButtonVisivility, setDeleteButtonVisivility] = useState(true);
	const date = new Date().getFullYear();
	const fetchURL = "http://localhost:80/readsync/backend/getCollections.php";
	const getBookRatingsEndpoint = "http://localhost:80/readsync/backend/statistics/getBookRating.php";

	
	const getCorrectData = (data) => {
		const newData = data.map(obj => obj.nombre);
    setCollectionsData(newData);
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				const url = new URL(fetchURL);
				url.searchParams.append('user', user);
				const response = await fetch(url, {
					method: 'GET',
					headers: {
							'Content-Type': 'application/json'
					}
				});
				const json = await response.json();
				if(json.length > 0 && json[0].result !== "Falta información de usuario"){
					getCorrectData(json[0].result);
				} else {
					throw new Error('Error al conseguir las colecciones');
				}


				const urlRatings = new URL(getBookRatingsEndpoint);
				urlRatings.searchParams.append('user', user);
				const response2 = await fetch(urlRatings, {
					method: 'GET',
					mode: "cors",
          headers: {
						"Accept": "application/json",
            'Content-Type': 'application/json'
          }
				});
				if (!response2.ok) {
					throw new Error('Error al conseguir los libros favoritos');
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


	const handleDeleteProfile = async (user) => {
		setDeletePopup(false);
		try {
			await deleteData(user, 'profile'); 
			logout(); 
			navigate('/sesion');
		} catch (err) {
			setError(err.message);
		}
	};


	//Reading Goal
	const [readingGoalData, setReadingGoalData] = useState("");
	const readingGoalEndPoint = "http://localhost:80/readsync/backend/getReadingGoal.php";
	const [readingGoal, setReadingGoal] = useState(false);
	const [readingGoalForm, setReadingGoalForm] = useState(true);
	const [successfullReadingGoal, setSuccessfullReadingGoal] = useState(false);

	useEffect(()=> {
		const getData = async ()=> {
			try{
				const urlReadingGoal = new URL(readingGoalEndPoint);
				urlReadingGoal.searchParams.append('user', user);
				const response = await fetch(urlReadingGoal, {
					method: 'GET',
					headers: {
							'Content-Type': 'application/json'
					}
				});
        const json = await response.json();
        setReadingGoalData(json);

				if (json && json[0].reading_goal <= json[0].num_books_read) {
          setSuccessfullReadingGoal(true);
        }

			} catch(err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}
		getData();

		const showReadingGoal = () => {
			if(readingGoalData && readingGoalData[0].result !== "No hay objetivo"){
				toggleReadingGoal();
			}
		}
		showReadingGoal();
	}, [loading, user])

	
	function toggleReadingGoal(){
		setReadingGoal(!readingGoal);
		setReadingGoalForm(!readingGoalForm);
	}



	return(
		<>
		{loading ? (<Loader />)
			:<section id="profile-section">
				{error && <MsgPopup error={error} setError={setError}/>}
				<h2>{user}</h2>

				{readingGoalForm ?
					<ReadingGoalForm 
						error={error}
						setError={setError}
						user={user}
					/> 
				: ""}

				{readingGoal ? 
					<ReadingGoal 
						successfullReadingGoal={successfullReadingGoal}
						date={date}
						toggleReadingGoal={toggleReadingGoal}
						setError={setError}
						readingGoal={readingGoalData[0].reading_goal}
						booksRead={readingGoalData[0].num_books_read}
					/> 
				: ""}

				{collectionsData && collectionsData.length > 0 ? 
						(<Carrousel 
							data={collectionsData} 
							date={date}
							title={"Colecciones"}
						/>)
						
				 : (<div className="noInfo chart-title center">Aún no tienes colecciones</div>)}
				
				{bookRatingsData.length > 0 && <BookRatings bookRatingsData={bookRatingsData}/>}

				<button className={deletButtonVisivility ? "delete-user-button" : "hide"} onClick={() => {setDeletePopup(!deletePopup); setDeleteButtonVisivility(!deletButtonVisivility)}}>
					Borrar cuenta
				</button>

				{deletePopup ? <div className="center" style={{display:"flex", rowGap: "20px"}}>
					<p>¿Estas seguro que quieres eliminar tu cuenta?</p>
					<div style={{display: "flex", columnGap: "30px"}}>
						<button className="delete-button" onClick={() => handleDeleteProfile()}>Borrar</button>
						<button className=" delete-button close-delete-button" onClick={() =>{setDeletePopup(!deletePopup); setDeleteButtonVisivility(!deletButtonVisivility)}}>Cerrar</button>
					</div>
				</div> : ''}

			</section>}
		</>
	)
}

export default Profile;