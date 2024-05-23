import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "./home";
import { useAuth } from '../components/AuthContext';
import '../stylesheets/book.css';
import ReadForm from "../components/ReadForm";
import MsgPopup from "../components/MsgPopup";
import Carrousel from "../components/Carrousel";

function Book(){
	const [data, setData] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const { isAuthenticated, user } = useAuth();
	const navigate = useNavigate();

	const [popup, setPopup] = useState(false);
	const [collectionForm, setCollectionForm] = useState(false);
	const [showMore, setShowMore] = useState(false);
	const [form, setForm] = useState(false);

	const { bookId } = useParams();

	const APIKey = "APIKey";
	const api = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${APIKey}`;

	const [title, setTitle] = useState("");
	const [subject, setSubject] = useState("");
	const [author, setAuthor] = useState("");
	const [bookAPIId, setBookAPIId] = useState("");
	const [pages, setPages] = useState("");
	const [comment, setComment] = useState("");
	const [rating, setRating] = useState("");
	const [format, setFormat] = useState("");
	const [cover, setCover] = useState("");
	const [categories, setCategories] = useState([]);
	const [date, setDate] = useState("");
	const [collectionName, setCollectionName] = useState("");

	const [collectionData, setCollectionData] = useState("");
	// Conseguimos la información del libro
	useEffect(() => {
    const getBookData = async () => {
      try{
        const response = await fetch(api);
        const json = await response.json();
        setData(json);

				if (json && Object.keys(json).length > 0) {
					const firstItem = json.volumeInfo;
					setTitle(firstItem.title);
					setAuthor(firstItem.authors ? firstItem.authors[0] : '');
					setBookAPIId(json.id);
					setPages(firstItem.pageCount);
					setCover(firstItem.imageLinks && firstItem.imageLinks.large ? firstItem.imageLinks.thumbnail : '');
					setCategories(extractCategories(firstItem.categories));
			}
      } catch(err) {
        setError(err.message);
      } finally {
				setLoading(false);
			}
    }
    getBookData();

  }, [api]);


	//Extraemos las categorias de la api y las ponemos en el formato adecuado para guardar
	const extractCategories = (arr) => {
		const wordSet = new Set();
		if(arr){
			arr.forEach(str => {
				const words = str.split(/\s*\/\s*/); 
				words.forEach(word => wordSet.add(word)); 
			});
		}
		return Array.from(wordSet); 
	};
	

// mostrar pop-up o no según inicio sesión
	const handlePopup = () => {
		isAuthenticated ? (
			setPopup(!popup)
		) : (
			navigate("/sesion")
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
        setRating(e);
        break;
			case "formDate":
				setError("");
				setDate(e.target.value);
				
			default:
				break;
		}
	}

	//Añadimos los libros a colecciones
	function handleAddCollection(value, collectionID){

		if(title !== "" && user != ""){
      var headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
      };

      var Data = {
				user: user,
        title: title,
				categories: categories.toString(),
				ID: bookAPIId,
        author: author,
        pages: pages,
				comment: comment,
				rating: rating,
				format: format,
				cover: cover,
				collectionName: collectionName,
				collectionID: collectionID,
				date: date
      }

			//dependiento del la colección a la que se añade se escoge el endpoint
			if(value === "Existe") {
				var fetchURL = "https://readsync.uabcilab.cat/backend/addBook.php";
			} else if (value === "noExiste") {
				var fetchURL = "https://readsync.uabcilab.cat/backend/createCollection.php";
			} else if (value === "Leídos") {
				var fetchURL = "https://readsync.uabcilab.cat/backend/addBookLeidos.php";
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
				setCollectionForm(false);
				setPopup(false);
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
						  const fetchURLCollections = "https://readsync.uabcilab.cat/backend/getCollections.php";
							const urlCollections = new URL(fetchURLCollections);
							urlCollections.searchParams.append('user', user);
							const response = await fetch( urlCollections, {
									method: 'GET',
									headers: {
											'Content-Type': 'application/json'
									}
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

	const navRef = useRef(null);
	const handleNavCategories = (direction) => {
    if (navRef.current) {
      if (direction === 'left') {
        navRef.current.scrollLeft -= 200;
      } else {
        navRef.current.scrollLeft += 200;
      }
    }
  };



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

				{cover && cover.length > 0 ? (
					<img src={`${cover}`} alt={`Portada de ${title}`}/>
				): (<div>No hay imagen disponible</div>)}
				
				<button className="add-to-collection-button" onClick={() => {
						handlePopup();
						getCollections(user);
					}}>+ Añadir a colección
				</button>
			</div>


			{/* COLUMNA DERECHA */}
			<div className="right-column">
				<h2> {title}</h2>


				{/* Mostramos subtitulo si hay */}
				{data.volumeInfo && data.volumeInfo.subtitle ? (
					<p>{data.volumeInfo.subtitle}</p>
				): ("")}

				{/* Mostramos descripcion si hay */}
				{data.volumeInfo && data.volumeInfo.description ? (
					<div className="book-description">
						<div dangerouslySetInnerHTML={{ __html: showMore ? data.volumeInfo.description : `${data.volumeInfo.description.substring(0, 250)}` }} />
						{data.volumeInfo.description.length > 250 && (
							<p className="show-description-button" onClick={() => setShowMore(!showMore)}>
								{showMore ? "Mostar menos" : "Mostrar más"}
							</p>
						)}
					</div>
				) : (
					<div>No hay descripción disponible</div>
				)}

				{/* Mostramos número de páginas si hay */}
				{pages ? (
					<p value={pages} className="book-data"><b>Número de páginas:</b> {pages}</p>
				): ("")}

				{/* Mostramos autor si hay */}
				{author ? (
					<p value={author} className="book-data"><b>Autor:</b> {author}</p>
				): ("")}

				{/* Mostramos editorial si hay */}
				{data.volumeInfo && data.volumeInfo.publisher ? (
					<p className="book-data"><b>Editorial:</b> {data.volumeInfo.publisher}</p>
				): ("")}

				{/* Mostramos categorías del libro si hay */}
				{data.volumeInfo && data.volumeInfo.categories && data.volumeInfo.categories.length > 0 ? (
					<Carrousel 
						data={data.volumeInfo.categories} 
						title={"Géneros"}
					/>
				) : ""}
				

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
							className="add-collection-button"
							onClick={() => {setForm(!form); setPopup(false)}}
						>Leídos</button>

					{collectionData && collectionData[0] && Array.isArray(collectionData[0].result) && collectionData[0].result.length > 0 && (
							collectionData[0].result.map((data, index) => (
									// miramos si data.nombre no es igual a "Leídos" para no mostrarla dos veces
									data.nombre !== "Leídos" &&
									<button 
										className="add-collection-button"
										key={index}
										onClick={() => handleAddCollection("Existe", data.id_coleccion)}
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
								onClick={() => handleAddCollection("noExiste", data.id_coleccion)}
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
