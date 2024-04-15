import '../stylesheets/statistics.css';
import BooksPages from "../components/statistics/BooksPages";
import NumBooks from "../components/statistics/NumBooks";
import { Loader } from "./home";
import { useAuth } from "../components/AuthContext";
import { useState, useEffect } from "react";
import MsgPopup from "../components/MsgPopup";
import BooksFormats from "../components/statistics/BookFormat";
import BookAuthors from "../components/statistics/BookAuthors";
import BookRatings from "../components/statistics/BookRatings";
import BookCategories from "../components/statistics/BookCategories";


function Statistics(){
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [numBookData, setNumBookData] = useState([]);
	const [bookPagesData, setBookPagesData] = useState([]);
	const [bookFormatData, setBookFormatData] = useState([]);
	const [bookAuthorData, setBookAuthorData] = useState([]);
	const [bookRatingsData, setBookRatingsData] = useState([]);
	const [bookCategories, setBookCategoriesData] = useState([]);

	const getNumBooksEndpoint = "http://localhost:80/readsync/backend/statistics/getNumBooks.php";
	const getBookPagesEndpoint = "http://localhost:80/readsync/backend/statistics/getBookPages.php";
	const getBookFormatEndpoint = "http://localhost:80/readsync/backend/statistics/getBookFormat.php";
	const getBookAuthorsEndpoint = "http://localhost:80/readsync/backend/statistics/getBookAuthors.php";
	const getBookRatingsEndpoint = "http://localhost:80/readsync/backend/statistics/getBookRating.php";
	const getBookCategoriesEndpoint = "http://localhost:80/readsync/backend/statistics/getBookCategories.php";


	//conseguimos toda la información necesaria para las estadísticas
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
					throw new Error('Failed to fetch number of books from backend');
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
				if (!response2.ok) {
					throw new Error('Failed to fetch number of pages from backend');
				}
				const bookPages = await response2.json();
        setBookPagesData(bookPages);


				//conseguimos los datos del número de formatos leídos
				const response3 = await fetch(getBookFormatEndpoint, {
					method: 'POST',
					mode: "cors",
          headers: {
						"Accept": "application/json",
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user: user })
				});
				if (!response3.ok) {
					throw new Error('Failed to fetch formats from backend');
				}
				const bookFormat = await response3.json();
        setBookFormatData(bookFormat);


				//conseguimos los datos del número de formatos leídos
				const response4 = await fetch(getBookAuthorsEndpoint, {
					method: 'POST',
					mode: "cors",
          headers: {
						"Accept": "application/json",
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user: user })
				});
				if (!response4.ok) {
					throw new Error('Failed to fetch authors from backend');
				}
				const bookAuthors = await response4.json();
				setBookAuthorData(bookAuthors);


				//conseguimos las calificaciones más altas del usuario
				const response5 = await fetch(getBookRatingsEndpoint, {
					method: 'POST',
					mode: "cors",
          headers: {
						"Accept": "application/json",
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user: user })
				});
				if (!response5.ok) {
					throw new Error('Failed to fetch ratings from backend');
				}
				const bookRatings = await response5.json();
				setBookRatingsData(bookRatings);


				//conseguimos los generos de la biblioteca del usuario
				const response6 = await fetch(getBookCategoriesEndpoint, {
					method: 'POST',
					mode: "cors",
          headers: {
						"Accept": "application/json",
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user: user })
				});
				if (!response6.ok) {
					throw new Error('Failed to fetch categories from backend');
				}
				const bookCategories = await response6.json();
				setBookCategoriesData(bookCategories);


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
			<section id="statistics-section">
				<div className='text-stadistics'>
					{numBookData[0][0].total_unique_books == 0 && numBookData[0][0].total_unique_books_read == 0 ? "" :
						<NumBooks 
							numBookData={numBookData}
						/>
					}

					{Object.values(bookPagesData[0][0]).every(value => value === null) ? "" :
						<BooksPages
							bookPagesData={bookPagesData}
						/>
					}
					</div>

					<BookRatings 
						bookRatingsData={bookRatingsData}
					/>
				

				<div className='graphics'>
					{bookFormatData[0].length == 0 ? "" : 
						<BooksFormats 
							bookFormatData={bookFormatData}
						/>
					}

					{bookAuthorData[0].length == 0 ? "":
						<BookAuthors 
							bookAuthorData={bookAuthorData}
						/>
					}

					<BookCategories
						bookCategories={bookCategories}
					/>
				</div>

			</section>
			)}


		</>
	)
}

export default Statistics;