import { Loader } from "../../pages/home";

const NumBooks = ({ numBookData }) => {
    console.log(numBookData, numBookData[0].result.total_unique_book);
    
    return(
        <>
        <div>
            {numBookData[0].result.total_unique_book} alooooooooooooo
        </div>
        </>
    )
}

export default NumBooks;