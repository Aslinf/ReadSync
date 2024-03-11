import BooksPages from "../components/statistics/booksPages";
import NumBooks from "../components/statistics/numBooks";
import { Loader } from "./home";
import { useAuth } from "../components/AuthContext";
import { useState, useEffect } from "react";
import MsgPopup from "../components/msgPopup";


function Statistics(){
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [numBookData, setNumBookData] = useState([]);
	const [bookPagesData, setBookPagesData] = useState([]);
	const getNumBooksEndpoint = "http://localhost:80/readsync/backend/statistics/getNumBooks.php";
	const getBookPagesEndpoint = "http://localhost:80/readsync/backend/statistics/getBookPages.php"

	useEffect(() => {
		const getData = async () => {
			try{
				//conseguimos los datos del número de libros leídos
				const response = await fetch(getNumBooksEndpoint, {
					method: 'POST',
					mode: "cors",
          headers: {
						"Accept": "application/json",
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user: user })
				});
				if (!response.ok) {
					throw new Error('Failed to fetch data from backend');
				}
				const numBooks = await response.json();
        setNumBookData(numBooks);

				//conseguimos los datos del número de páginas leídas
				const response2 = await fetch(getBookPagesEndpoint, {
					method: 'POST',
					mode: "cors",
          headers: {
						"Accept": "application/json",
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user: user })
				});
				if (!response.ok) {
					throw new Error('Failed to fetch data from backend');
				}
				const bookPages = await response2.json();
        setBookPagesData(bookPages);
        setLoading(false);

			}catch(err){
				setError(err.message);
				setLoading(false);
			}
		}
		getData();
	}, [user, getNumBooksEndpoint, getBookPagesEndpoint]);


	return(
		<>
			{error && (<MsgPopup error={error} setError={setError}/>)}

			{loading ? (<Loader />)
			:(
			<section>
				<NumBooks 
					numBookData={numBookData}
				/>

				<BooksPages
					bookPagesData={bookPagesData}
				/>
			</section>
			)}


		</>
	)
}

export default Statistics;