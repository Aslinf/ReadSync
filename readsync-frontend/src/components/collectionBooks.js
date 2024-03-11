import { useParams, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { useState, useEffect } from "react";
import { Loader } from "../pages/home";
import MsgPopup from "./msgPopup";
import "../stylesheets/collection-books.css";

function CollectionBooks() {

  const { collection } = useParams();
  const { user } = useAuth();
  const [bookData, setBookData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const fetchURL = "http://localhost:80/readsync/backend/getUserBooks.php"; 
  
    useEffect(() => {
      if (user) { 
          const fetchData = async () => {
              try {
                  const response = await fetch(fetchURL, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({ 
                          user: user,
                          collectionName: collection
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
          fetchData();
      }
  }, [user, fetchURL, collection]); 


    const deleteData = async (id, type) => {
      try {
        const response = await fetch('http://localhost:80/readsync/backend/deleteData.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            id: id, 
            type: type
          })
      });
          const data = await response.json();
          if (data.result === "Book deleted successfully") {
            setDeleteSuccess(true);
        } 
        } catch (err) {
          setError(err.message);
        }
      };

    if (deleteSuccess) {
      window.location.reload(); 
    }
  
    
  return(
    <>
      {loading ? 
				(<Loader />)
			:
      (<section id="book-library-section">
        {error && (<MsgPopup error={error} setError={setError}/>)}

        <h2>{collection}</h2>
				
        <div className="books-section">
          {bookData[0] && bookData[0]?.result && bookData[0]?.result?.length > 0 && (
							bookData[0].result.map((data, index) => (
                <div key={index} className="book-container">
                  <p onClick= {() => deleteData(data.idLibro, "book")}>X</p>
                  <Link to={`/libro/${data.ID}`}>
                    <div >
                      <img src={`${data.portada}`} alt="Portada libro"/>
                    </div>
                  </Link>
                </div>
							))
						)}
        </div>
				
      </section>)
      }
  
    </>
  )
}

export default CollectionBooks;