import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";

function BookRatings({ bookRatingsData }){

	//funcionamiento del carrousel
	const navRef = useRef(null);
	const handleNavRatings = (direction) => {
		if (navRef.current) {
			if (direction === 'left') {
				navRef.current.scrollLeft -= 200;
			} else {
				navRef.current.scrollLeft += 200;
			}
		}
	};


	return(
		<div className="best-ratings-container center">
			{bookRatingsData && bookRatingsData[0] && bookRatingsData[0].length > 0 ? 
			<div className="center">
				<p className="chart-title">Mis libros favoritos: </p>
				<ReactStars 
					count={5}
					size={50}
					value={5}
					isHalf={true}
					color={"#d3b79e"}
					activeColor={"#895845"}
					edit={false}
				/>

				<div className="five-stars-ratings">
					<button className="book-ratings-button" onClick={() => handleNavRatings('left')}>{`<`}</button>
						<ul ref={navRef} className="five-stars-books-container">
				
							{bookRatingsData[0].map((book, index) =>
								(<Link to={`/libro/${book.ID}`} key={index} className="book-five-rating">
									<img src={book.portada} alt={`Book ${index + 1}`} />
								</Link>)
							) }
								
						</ul>
					<button className="book-ratings-button" onClick={() => handleNavRatings('right')}>{`>`}</button>
				</div>
			</div>

			: <p className="chart-title" style={{paddingTop: "20px"}}>Aún no tienes libros favoritos</p>}
		</div>
	)
}

export default BookRatings;