
const NumBooks = ({ numBookData }) => {
	
	return(
		<>
		<div className="num-books center">
			<p>
				Libros en tu biblioteca: <span className="highlight">{numBookData[0][0].total_unique_books}</span>
			</p>
			<p>
				Libros leídos: <span className="highlight">{numBookData[0][0].total_unique_books_read}</span> 
			</p>
		</div>
		</>
	)
}

export default NumBooks;