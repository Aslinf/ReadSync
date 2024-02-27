import { useParams } from "react-router-dom";

function CollectionBooks() {

  const { collection } = useParams()
  return(
    <>
      <h2>{collection}</h2>
      <p>Holaaaaaa</p>
    </>
  )
}

export default CollectionBooks;