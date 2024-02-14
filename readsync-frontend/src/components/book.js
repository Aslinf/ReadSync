import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../pages/home";
import '../stylesheets/book.css';
import { wait } from "@testing-library/user-event/dist/utils";

function Book(){
	const [data, setData] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	const [authorKey, setAuthorKey] = useState('');
	const [authorData, setAuthorData] = useState('');
	const [worKey, setWorKey] = useState('');
	const [workData, setWorkData] = useState('');

	const [popup, setPopup] = useState(false);
	const [collectionForm, setCollectionForm] = useState(false);
	const [button, setButton] = useState(true);

	const { bookId } = useParams();

	const api = `https://openlibrary.org/isbn/${bookId}.json`;

	// get book specific edition data
	useEffect(() => {
    const getData = async () => {
      try{
        const response = await fetch(api);
        const json = await response.json();
        setData(json);
				const firstAuthorKey = json.authors[0].key;
				const bookWorKey = json.works[0].key
				if (firstAuthorKey) {
					setAuthorKey(firstAuthorKey);
					setWorKey(bookWorKey);
				}
      } catch(err) {
        setError(err.message);
      } finally {
				setLoading(false);
			}
    }
    getData();
  }, [api]);

// Get author info
	useEffect(() => {
		const getAuthor = async () => {
			if (authorKey){
				const authorApi = `https://openlibrary.org${authorKey}.json`;
				try{
					const response = await fetch(authorApi);
					const json = await response.json();
					setAuthorData(json);
				} catch(err) {
					setError(err.message)
				}
			}
		}
		getAuthor();
	}, [authorKey]);

	// get book general info
	useEffect(() => {
		const getWorkData = async () => {
			if(worKey) {
				const workApi = `https://openlibrary.org${worKey}.json`;
				try{
					const response = await fetch(workApi);
					const json = await response.json();
					setWorkData(json);
				} catch(err){
					setError(err.message);
				}
			}
		}
		getWorkData();

	}, [worKey])

	const handlePopup = () => {setPopup(!popup);}

	const handleForm = () => {setCollectionForm(!collectionForm);}

	function handleAddToCollection(){

	}

	return(
		<>	
			<Header/>

			{loading ? (<div className="cargando">Cargando...</div>)
			:(<section className="book-section">
				{error && (<div>{`There is a problem fetching the post data - ${error}`}</div>)}
				
				<div className="left-column">
					{data.covers && data.covers.length > 0 ? (
						<img src={`https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`} alt={`Portada de ${data.title}`}/>
					): (<div>No hay imagen disponible</div>)}
					
					<button onClick={handlePopup}>+ Añadir a colección</button>
				</div>

				<div className="right-column">
					<h2>{data.title}</h2>
					{workData && workData.description ? (
						<p className="book-description">{workData.description.value}</p>
					): (<div>No hay descripción disponible</div>)}

					<div className="user-book-rating">
						<p>Mi valoración: </p>
					</div>

					{data && data.number_of_pages ? (
						<p>Número de páginas: {data.number_of_pages}</p>
					): ("")}
			
					{authorData && authorData.name ? (
						<p>Autor: {authorData.name}</p>
					): ("")}

					{authorData.bio && typeof authorData.bio === 'string' ? (
            <p>Biografía autor: {authorData.bio}</p>
					) : authorData.bio && authorData.bio.value ? (
							<p>Biografía autor: {authorData.bio.value}</p>
					) : (
							<p>No hay biografía disponible</p>
					)}
				

					<div className="book-subjects">
						<ul>
						
						</ul>
					</div>

					<div className="this-edition">
						<h3>Esta Edición</h3>
					</div>

					<div className="user-review">
					{data && data.edition_name ? (
						<p>{data.edition_name}</p>
					): ("")}
					</div>
				</div>

				{popup ? <div className="overlay">
					<div className="popup">
						<h3>Selecciona la colección a la que añadir el libro</h3>
						<span className="close-popup" onClick={handlePopup}>X</span>
						<div className="popup-content">
							<button onClick={handleAddToCollection}>Leídos</button>
							
							{collectionForm ? <div className="collectionForm">
								<input placeholder="Nombre de la colección"/>
								<button onClick={handleAddToCollection} className="add-collection">Añadir</button>
							</div> : ""}
							<button onClick={handleForm} className="add-collection">Añadir más colecciones</button>
						</div>
					</div>
				</div>
				: ""}

	
			</section>
			)}
		</>
	);
}

export default Book;