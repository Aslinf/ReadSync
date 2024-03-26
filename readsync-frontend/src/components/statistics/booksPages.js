import { Link } from 'react-router-dom';

const BooksPages = ({ bookPagesData }) => {

    console.log(bookPagesData);

    const getBookPagesData = bookPagesData[0][0];
    
    return(
        <>
        <div className="book-pages">
            <p>
                Total de páginas leídas: <span className='highlight'>{getBookPagesData?.total_pages}</span>
            </p>
            <div className='book-pages-books'>
                {bookPagesData[0][0].max_pages_book_name === null ? "" :
                    <Link to={`/libro/${getBookPagesData?.ID_library}`} className="book">
                        <p>Libro más largo de la biblioteca:</p>
                        <p>{getBookPagesData?.max_pages_book_name_library}</p>
                        <p>Número de páginas: <span className='highlight'>{getBookPagesData?.max_pages_library}</span></p>
                        <img src={`${getBookPagesData?.portada_library}`} />
                    </Link>
                }

                {bookPagesData[0][0].max_pages_book_name_read === null ? "" :
                    <Link to={`/libro/${getBookPagesData?.ID_read}`} className="book">
                        <p>Libro más largo leído:</p>
                        <p>{getBookPagesData?.max_pages_book_name_read}</p>
                        <p>Número de páginas: <span className='highlight'>{getBookPagesData?.max_pages_read}</span></p>
                        <img src={`${getBookPagesData?.portada_read}`} />
                    </Link>
                }
            </div>
        </div>
        </>
    )
}

export default BooksPages;