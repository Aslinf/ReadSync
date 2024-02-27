import { Header } from "./home";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "../stylesheets/library.css";
import { Loader } from "./home";

function Library() {

	const { user } = useAuth();
	const [collectionData, setCollectionData] = useState("");
	const [loading, setLoading] = useState("");
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
					setCollectionData(json);
			} catch (err) {
					setError(err.message);
			} finally {
					setLoading(false);
			}
	}
	fetchData();
	}, )

	return(
		<>
			<Header />

			{loading ? (<Loader />)
				:(<section id="library-section">
				{error && (<div>{`${error}`}</div>)}
				
				{collectionData[0] && collectionData[0].result && collectionData[0].result.length > 0 && (
							collectionData[0].result.map((data, index) => (
								<Link key={index} to={`/biblioteca/${data.nombre}`}>
									<div className="collection-container">
										<p className="collection-name">{data.nombre}</p>
									</div>
								</Link>
							))
						)}

			</section>
			)}
		</>
	)
}

export default Library;