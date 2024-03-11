import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "../stylesheets/library.css";
import MsgPopup from "./msgPopup";
import { Loader } from "../pages/home";

function ShowCollections({ deleteData }) {
    const { user } = useAuth();
    const [collectionData, setCollectionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const fetchURL = "http://localhost:80/readsync/backend/getCollections.php";

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
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
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

                        {collectionData.length > 0 && collectionData[0]?.result && collectionData[0].result.length > 0 && (
                            collectionData[0].result.map((data, index) => (
                                <div key={index} className="collection-container">
                                    <p onClick={() => handleDeleteCollection(data.id_coleccion)}>X</p>
                                    <Link to={`/biblioteca/${data.nombre}`} >
                                        <div>
                                            <p className="collection-name">{data.nombre}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        )}

                    </section>
                )}
        </>
    )
}

export default ShowCollections;

