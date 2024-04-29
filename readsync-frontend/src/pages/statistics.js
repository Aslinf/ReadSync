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
		const getStatistics = async () => {
			try{
				//conseguimos los datos del número de libros leídos
				const urlgetNumBooks = new URL(getNumBooksEndpoint);
				urlgetNumBooks.searchParams.append('user', user);
				const response = await fetch(urlgetNumBooks, {
					method: 'GET',
					mode: "cors",
          headers: {
						"Accept": "application/json",
            'Content-Type': 'application/json'
          }
				});
				if (!response.ok) {
					throw new Error('Error al conseguir el número de libros leídos');
				}
				const numBooks = await response.json();
        setNumBookData(numBooks);


				//conseguimos los datos del número de páginas leídas
				const urlgetBookPages = new URL(getBookPagesEndpoint);
				urlgetBookPages.searchParams.append('user', user);
				const response2 = await fetch(urlgetBookPages, {
					method: 'GET',
					mode: "cors",
          headers: {
						"Accept": "application/json",
            'Content-Type': 'application/json'
          }
				});
				if (!response2.ok) {
					throw new Error('Error al conseguir el númeor de páginas leídas');
				}
				const bookPages = await response2.json();
        setBookPagesData(bookPages);


				//conseguimos los datos del número de formatos leídos
				const urlgetBookFormat = new URL(getBookFormatEndpoint);
				urlgetBookFormat.searchParams.append('user', user);
				const response3 = await fetch(urlgetBookFormat, {
					method: 'GET',
					mode: "cors",
          headers: {
						"Accept": "application/json",
            'Content-Type': 'application/json'
          }
				});
				if (!response3.ok) {
					throw new Error('Error al conseguir los formatos leídos');
				}
				const bookFormat = await response3.json();
        setBookFormatData(bookFormat);


				//conseguimos los datos del número de formatos leídos
				const urlgetBookAuthors = new URL(getBookAuthorsEndpoint);
				urlgetBookAuthors.searchParams.append('user', user);
				const response4 = await fetch(urlgetBookAuthors, {
					method: 'GET',
					mode: "cors",
          headers: {
						"Accept": "application/json",
            'Content-Type': 'application/json'
          }
				});
				if (!response4.ok) {
					throw new Error('Error al conseguir los autores leídos');
				}
				const bookAuthors = await response4.json();
				setBookAuthorData(bookAuthors);


				//conseguimos las calificaciones más altas del usuario
				const urlGetBookRating = new URL(getBookRatingsEndpoint);
				urlGetBookRating.searchParams.append('user', user);
				const response5 = await fetch(urlGetBookRating, {
					method: 'GET',
					mode: "cors",
          headers: {
						"Accept": "application/json",
            'Content-Type': 'application/json'
          }
				});
				if (!response5.ok) {
					throw new Error('Error al conseguir los libros favoritos');
				}
				const bookRatings = await response5.json();
				setBookRatingsData(bookRatings);


				//conseguimos los generos de la biblioteca del usuario
				const urlgetBookCategoriesEndpoint = new URL(getBookCategoriesEndpoint);
				urlgetBookCategoriesEndpoint.searchParams.append('user', user);
				const response6 = await fetch(urlgetBookCategoriesEndpoint, {
					method: 'GET',
					mode: "cors",
          headers: {
						"Accept": "application/json",
            'Content-Type': 'application/json'
          }
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
		getStatistics();
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