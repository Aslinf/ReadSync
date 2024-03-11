import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header, Loader } from "./home";
import { useAuth } from '../components/AuthContext';
import '../stylesheets/book.css';
import ReadForm from "../components/readForm";
import MsgPopup from "../components/msgPopup";

function Book(){
	const [data, setData] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const { isAuthenticated, user } = useAuth();
	const navigate = useNavigate();

	const [popup, setPopup] = useState(false);
	//const [popupMsg, setPopupMsg] = useState(false);
	const [collectionForm, setCollectionForm] = useState(false);
	const [showMore, setShowMore] = useState(false);
	const [form, setForm] = useState(false);

	const { bookId } = useParams();

	const APIKey = "AIzaSyBMESbDd7GPd7uKJgr-KFz0A6U5j6CMfA8";
  const api = `https://www.googleapis.com/books/v1/volumes?q=intitle:${bookId}&key=${APIKey}&maxResults=10`;

	const [title, setTitle] = useState("");
	const [subject, setSubject] = useState("");
	const [author, setAuthor] = useState("");
	const [bookAPIId, setBookAPIId] = useState("");
	const [pages, setPages] = useState("");
	const [comment, setComment] = useState("");
	const [rating, setRating] = useState("");
	const [format, setFormat] = useState("");
	const [cover, setCover] = useState("");
	const [collectionName, setCollectionName] = useState("");

	const [collectionData, setCollectionData] = useState("");
	// Conseguimos la información del libro
	useEffect(() => {
    const getData = async () => {
      try{
        const response = await fetch(api);
        const json = await response.json();
        setData(json);

				if (json && json.items && json.items.length > 0) {
					const firstItem = json.items[0].volumeInfo;
					setTitle(firstItem.title);
					setAuthor(firstItem.authors ? firstItem.authors[0] : '');
					setBookAPIId(json.items[0].id);
					setPages(firstItem.pageCount);
					setCover(firstItem.imageLinks ? firstItem.imageLinks.thumbnail : '');
			}
      } catch(err) {
        setError(err.message);
      } finally {
				setLoading(false);
			}
    }
    getData();

  }, [api]);

// mostrar pop-up o no según inicio sesión
	const handlePopup = () => {
		isAuthenticated ? (
			setPopup(!popup)
		) : (
			navigate("/signin-up")
		)	 
	}

	//conseguimos el nombre de la coleccion
	const handleInputChange = (e, type) => {
    switch(type){
      case "collectionName":
        setError("");
        setCollectionName(e.target.value);
        if(e.target.value === ""){
          setError("¡Este campo no puede estar vacío!")
        }
				break;
			case "formComment":
				setError("");
        setComment(e.target.value);
				break;
			case "formFormat":
				setError("");
        setFormat(e.target.value);
				break;
			case "formRating":
				setError("");
        setRating(e.target.value);
        break;
			default:
				break;
		}
	}

	//Añadimos los libros a colleciones
	function handleAddCollection(data, value, collectionID){

		if(title !== "" && user != ""){
      var headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
      };

      var Data = {
				user: user,
        title: title,
				subject: subject,
				ID: bookAPIId,
        author: author,
        pages: pages,
				comment: comment,
				rating: rating,
				format: format,
				cover: cover,
				collectionName: collectionName,
				collectionID: collectionID
      }

			//dependiento del la colección a la que se añade se escoge el endpoint
			if(value === "Existe") {
				var fetchURL = "http://localhost:80/readsync/backend/addBook.php";
			} else if (value === "noExiste") {
				var fetchURL = "http://localhost:80/readsync/backend/createCollection.php";
			} else if (value === "Leídos") {
				var fetchURL = "http://localhost:80/readsync/backend/addBookLeidos.php";;
			}

      fetch(fetchURL, {
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
      });

      setCollectionName("");

    }else {
      setError("¡Faltan datos!");
    }
	}

// Conseguimos los datos de las colecciones
	function getCollections(user) {
			const fetchData = async () => {
					try {
							const response = await fetch("http://localhost:80/readsync/backend/getCollections.php", {
									method: 'POST',
									headers: {
											'Content-Type': 'application/json'
									},
									body: JSON.stringify({ user: user }) 
							});
							const json = await response.json();
							setCollectionData(json);
					} catch (err) {
							setError(err.message);
					} finally {
							setLoading(false);
					}
			}
			fetchData();
	}

	return(
		<>	

			{loading ? (<Loader />)
			:(<section id="book-section">
			{error && (
				<MsgPopup error={error} setError={setError}/>
			)}

			
		

			{/* COLUMNA IZQUIERDA */}
			<div className="left-column">
				{/* Mostrarmos la imagen si hay */}
				{data.items[0].volumeInfo && data.items[0].volumeInfo.imageLinks && data.items[0].volumeInfo.imageLinks.thumbnail ? (
					<img src={`${data.items[0].volumeInfo.imageLinks.thumbnail}`} alt={`Portada de ${data.items[0].volumeInfo.title}`}/>
				): (<div>No hay imagen disponible</div>)}
				
				<button onClick={() => {
						handlePopup();
						getCollections(user);
					}}>+ Añadir a colección
				</button>
			</div>

			{/* COLUMNA DERECHA */}
			<div className="right-column">
				<h2> {data.items[0].volumeInfo.title}</h2>

				{/* Mostramos subtitulo si hay */}
				{data.items[0].volumeInfo && data.items[0].volumeInfo.subtitle ? (
					<p>{data.items[0].volumeInfo.subtitle}</p>
				): ("")}

				{/* Mostramos descripcion si hay */}
				{data.items[0].volumeInfo && data.items[0].volumeInfo.description ? (
					<div className="book-description">
					
						<p>{showMore ? `${data.items[0].volumeInfo.description}` : `${data.items[0].volumeInfo.description.substring(0, 250)}`}</p>
						<p className="show-description-button" onClick={() => setShowMore(!showMore)}>
							{showMore ? "Mostar menos" : "Mostrar más"}
						</p>
					</div>
				): (<div>No hay descripción disponible</div>)}

				{/* Mostramos número de páginas si hay */}
				{data.items[0].volumeInfo && data.items[0].volumeInfo.pageCount ? (
					<p value={pages} className="book-data"><b>Número de páginas:</b> {data.items[0].volumeInfo.pageCount}</p>
				): ("")}

				{/* Mostramos autor si hay */}
				{data.items[0].volumeInfo && data.items[0].volumeInfo.authors && data.items[0].volumeInfo.authors.length > 0 ? (
					<p value={author} className="book-data"><b>Autor:</b> {data.items[0].volumeInfo.authors}</p>
				): ("")}

				{/* Mostramos editorial si hay */}
				{data.items[0].volumeInfo && data.items[0].volumeInfo.publisher ? (
					<p className="book-data"><b>Editorial:</b> {data.items[0].volumeInfo.publisher}</p>
				): ("")}

				{/* Mostramos categorías del libro si hay */}
				<div className="book-subjects">
					<span>Categorías: </span>
					<ul>
						{data.items && data.items[0].volumeInfo && data.items[0].volumeInfo.categories && data.items[0].volumeInfo.categories.length > 0 ? (
						data.items[0].volumeInfo.categories.map((category, index) => (
								<li key={index}>{category}</li>
						))
						) : ""}
					</ul>
				</div>

				{data && data.valoración ? (
				<div className="user-book-rating">
						<p>Mi valoración: {data.valoración}</p>
				</div>) : ("")}

			</div>

			{form ? 
				<ReadForm 
					setForm={setForm} 
					setPopup={setPopup} 
					handleInputChange={handleInputChange}
					handleAddCollection={handleAddCollection}
					data={data}
				/>
			:""}

			{/* Mostramos pop-up si se hace click el botón */}
			{popup ? <div className="overlay">
				<div className="popup">
					<h3>Selecciona la colección a la que añadir el libro</h3>
					<span className="close-popup" onClick={() => 
					{if (collectionForm) {
						setCollectionForm(false);
					}
					setPopup(false);}}>X</span>
					<div className="popup-content">
						<button
							onClick={() => {setForm(!form); setPopup(false)}}
						>Leídos</button>

				{collectionData && collectionData[0] && Array.isArray(collectionData[0].result) && collectionData[0].result.length > 0 && (
						collectionData[0].result.map((data, index) => (
								// miramos si data.nombre no es igual a "Leídos" para no mostrarla dos veces
								data.nombre !== "Leídos" &&
								<button 
										key={index}
										onClick={() => handleAddCollection(data, "Existe", data.id_coleccion)}
								>{data.nombre}</button>
						))
				)}

						{collectionForm ? <div className="collectionForm">
							<input 
							type="text"
							name="collectionName"
							value={collectionName}
							onChange={(e)=> handleInputChange(e, "collectionName")}
							placeholder="Nombre de la colección"/>

							<input 
								type="submit"
								defaultValue="submit"
								className='add-collection'
								onClick={() => handleAddCollection(data, "noExiste")}
								/>
							
						</div> : ""}
						{collectionForm ? ("") :<button onClick={() => setCollectionForm(!collectionForm)} className="add-collection">Añadir más colecciones</button>}
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