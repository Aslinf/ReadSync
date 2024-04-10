import { Header, Loader } from "./home";
import { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import "../stylesheets/search.css";
import ReactPaginate from 'react-paginate';

function Search(){

	const [data, setData] = useState([]);
  const [error, setError]= useState(null);
	const [loading, setLoading] = useState(true);
	const { book } = useParams();

	const APIKey = "AIzaSyBMESbDd7GPd7uKJgr-KFz0A6U5j6CMfA8";

	const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
	const RESULTS_PER_PAGE = 8;


	useEffect(() => {
    //conseguimos los resultados de búsqueda
    const fetchData = async () => {
      try {
        const startIndex = currentPage * RESULTS_PER_PAGE;
        const api = `https://www.googleapis.com/books/v1/volumes?q=intitle:${book}&key=${APIKey}&startIndex=${startIndex}&maxResults=${RESULTS_PER_PAGE}`;
        const response = await fetch(api);
        const json = await response.json();
        setData(json.items || []);
        console.log(json);
        const totalItems = json.totalItems || 0;
        setTotalPages(Math.ceil(totalItems / RESULTS_PER_PAGE));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [book, currentPage, APIKey]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

	return(
		<>

		<section className="search-container center">
      <div className="search-container-results center">
			{loading ? 
				(<Loader />)
			: (data.length > 0 && data.map((data) => (
				
					<Link key={`${data.id}`} to={`/libro/${data.id}`} className="book-result-container">
						{data.volumeInfo && data.volumeInfo.imageLinks && data.volumeInfo.imageLinks.smallThumbnail ? (
						<img alt={`Portada del libro ${data.volumeInfo.title}`} src={`${data.volumeInfo.imageLinks.smallThumbnail}`}/>) 
						: (<div></div>)}
						<div className="book-result-content">
							<p>{data.volumeInfo.title}</p>
							<p>Por: {data.volumeInfo && data.volumeInfo.authors && data.volumeInfo.authors.length > 0 ? data.volumeInfo.authors[0] : "Autor desconocido"}</p>
							<p>Año de publicación: {data.volumeInfo && data.volumeInfo.publishedDate ? data.volumeInfo.publishedDate.slice(0,4) : "Año desconocido"}</p>
						</div>
					</Link>
				
			))
			)}
      </div>

			<div className="pagination">
          <ReactPaginate
            pageCount={totalPages || 1} 
            pageRangeDisplayed={5}
            marginPagesDisplayed={2}
            onPageChange={handlePageChange}
            containerClassName="pagination"
            activeClassName="active"
            previousLabel="<"
            nextLabel=">"
          />
        </div>

		</section>
		</>
	);
}

export default Search;
