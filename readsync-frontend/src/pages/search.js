import { Header } from "./home";
import { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import "../stylesheets/search.css";

function Search(){

	const [data, setData] = useState([]);
  const [error, setError]= useState(null);
	const [loading, setLoading] = useState(true);
	const { book } = useParams();
	//const navigate = useNavigate();
  const api = `http://openlibrary.org/search.json?q=${book}&limit=8`;

  useEffect(() => {
    const getData = async () => {
      try{
        const response = await fetch(api);
        const json = await response.json();
        setData(json);
      } catch(err) {
        setError(err.message);
      } finally {
		setLoading(false);
      }
    }
    getData();
  }, [api]);


	return(
		<>
		<Header/>

		<section className="search-container">
			{loading ? (
			<p>Cargando...</p>
			)
			: (data && data.docs
				.filter(data => data.isbn && data.isbn[0] !== null)
				.map((data) => (
				
					<Link key={`${data.isbn[0]}`} to={`/libro/${data.isbn[0]}`} className="book-result-container">
						<img alt="" src={`https://covers.openlibrary.org/b/id/${data.cover_i}-S.jpg`}/>
						<div className="book-result-content">
							<p>{data.title}</p>
							<p>Por: {data.author_name[0]}</p>
							<p>Ediciones: {data.edition_count}</p>
							<p>Año de publicación: {data.first_publish_year}</p>
						</div>
					</Link>
				
			))
			)}

		</section>
		</>
	);
}

export default Search;
