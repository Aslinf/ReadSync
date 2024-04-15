import { useRef } from "react";
import "../stylesheets/book.css";

function Carrousel({ data, title }){

	const navRef = useRef(null);
	const handleNavCategories = (direction) => {
		if (navRef.current) {
			if (direction === 'left') {
				navRef.current.scrollLeft -= 200;
			} else {
				navRef.current.scrollLeft += 200;
			}
		}
	};

    return(
        <>
			<div className="book-subjects">
				<span><b>{title}</b> </span>
				<div className="book-subjects-content">
					<button className="book-categories-button" onClick={() => handleNavCategories('left')}>{`<`}</button>
					<ul ref={navRef} className="book-categories">

						{data.map((category, index) => (
								<li key={index} className="book-category">{category}</li>
						))}
						
					</ul>
					<button className="book-categories-button" onClick={() => handleNavCategories('right')}>{`>`}</button>
				</div>
			</div>
        </>
    )
}

export default Carrousel;