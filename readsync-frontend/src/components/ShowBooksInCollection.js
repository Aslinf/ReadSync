import { useParams, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";
import { Loader } from "../pages/home";
import MsgPopup from "./MsgPopup";
import ReactStars from "react-rating-stars-component";
import "../stylesheets/collection-books.css";
import deleteData from "../pages/library";

import { useLocation } from 'react-router-dom';

function CollectionBooks() {

  const location = useLocation();
  const { collectionID } = location.state;
  const { collection } = useParams();
  const { user } = useAuth();
  const [bookData, setBookData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteMode, setDeteleMode] = useState(false);
  const fetchURL = "http://localhost:80/readsync/backend/getUserBooks.php"; 
  
    useEffect(() => {
      if (user) { 
          const fetchUserBooks = async () => {
              try {
                  const response = await fetch(fetchURL, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({ 
                          user: user,
                          collectionID: collectionID
                      })
                  });
                  const json = await response.json();
                  setBookData(json);
              } catch (err) {
                  setError(err.message);
              } finally {
                  setLoading(false);
              }
          }
          fetchUserBooks();
      }
  }, [user, fetchURL, collection]); 


  const handleDeleteBook = async (id) => {
    try {
      await deleteData(id, 'book');
      window.location.reload(); 
    } catch (err) {
        setError(err.message);
    }
  };
    
  return(
    <>
      {loading ? 
				(<Loader />)
			:
      (<section id="book-library-section">
        {error && (<MsgPopup error={error} setError={setError}/>)}

        <div className="delete-library-container">
          <h2>{collection}</h2>
          <button onClick={() => setDeteleMode(!deleteMode)}>Eliminar Libro</button>
        </div>
				
        <div className="books-section">

            {collection === "Leídos" ? (bookData[0] && bookData[0]?.result && bookData[0]?.result?.length > 0 && (
                bookData[0].result.map((data, index) => (
                  <div key={index} className="book-container book-leidos-container-size">
                    <div className={deleteMode ? "delete-true center" : "delete-false" }>
                      <p onClick= {() => handleDeleteBook(data.idLibro)}><strong>X</strong></p>
                    </div>
                    
                    <Link to={`/libro/${data.ID}`}>
                      {data.portada === "" ? ("") : <img src={`${data.portada}`} alt="Portada libro"/> }
                    </Link>
                    <div className="center book-info">
                      <Link to={`/libro/${data.ID}`}>
                        <p>{data.nombre}</p>
                      </Link>
                      <ReactStars 
                        count={5}
                        size={30}
                        value={data.calificacion}
                        isHalf={true}
                        color={"#d3b79e"}
                        activeColor={"#895845"}
                        edit={false}
                      />
                      {data.formato ? <p><strong>Formato: </strong>{data.formato}</p> : ""}
                      {data.comentario ?<p><strong>Comentario: </strong>{data.comentario}</p> : ""}
                      
                      
                    </div>
                  </div>
                ))
              )) 

            
              :(bookData[0] && bookData[0]?.result && bookData[0]?.result?.length > 0 && (
                bookData[0].result.map((data, index) => (
                  <div key={index} className="book-container center book-container-size">
                    <div className={deleteMode ? "delete-true center" : "delete-false" }>
                      <p onClick= {() => handleDeleteBook(data.idLibro)}><strong>X</strong></p>
                    </div>
                    <Link to={`/libro/${data.ID}`} className="book-gap center">
                      <p>{data.nombre}</p>
                      {data.portada === "" ? ("") : <img src={`${data.portada}`} alt="Portada libro"/> }
                    </Link>
                  </div>
                ))
              ))
            }
            
        </div>
				
      </section>)
      }
  
    </>
  )
}

export default CollectionBooks;