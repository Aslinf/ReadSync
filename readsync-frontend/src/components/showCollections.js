import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../stylesheets/library.css";
import MsgPopup from "./MsgPopup";
import { Loader } from "../pages/home";

function ShowCollections({ deleteData }) {
    const { user } = useAuth();
    const [collectionData, setCollectionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
	const [deleteMode, setDeteleMode] = useState(false);
    const fetchURL = "http://localhost:80/readsync/backend/getCollections.php";

    useEffect(() => {
        const getCollections = async () => {
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
						if (json[0].result !== "Falta información de usuario") {
							setCollectionData(json);
						} else {
							setCollectionData([]);
							setError(json[0].result);
						}
					} catch (err) {
							setError(err.message);
					} finally {
							setLoading(false);
					}
        }
        getCollections();
    }, [user, fetchURL])


    const handleDeleteCollection = async (id) => {
        try {
            await deleteData(id, 'collection');
			window.location.reload(); 
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            {loading ? (<Loader />)
                : (
                    <section id="library-section">
                        {error && error !== "Falta información de usuario" && (<MsgPopup error={error} setError={setError}/>)}

												<div className="delete-library-container">
													<h2>Biblioteca</h2>
													<button onClick={() => setDeteleMode(!deleteMode)}>Eliminar Colección</button>
												</div>

												<div className="library-collections">
													{collectionData.length > 0 && collectionData[0]?.result !== `Ninguna colección de ${user}` 
													? collectionData.length > 0 && collectionData[0]?.result && collectionData[0].result.length > 0 && (
															collectionData[0].result.map((data, index) => (
																	<div key={index} className="collection-container center">
																		<div className={deleteMode ? "delete-true center" : "delete-false" }>
																			<p onClick={() => handleDeleteCollection(data.id_coleccion)}>X</p>
																		</div>
																		<Link to={`/biblioteca/${data.nombre}`} state={{collectionID : data.id_coleccion}}>
																				<p className="collection-name">{data.nombre}</p>
																		</Link>
																	</div>
															))
													) : <div className="noInfo">No hay colecciones</div>}
												</div>
                        

                    </section>
                )}
        </>
    )
}

export default ShowCollections;

