import { useState } from "react";
import "../stylesheets/library.css";
import ShowCollections from "../components/showCollections";
import MsgPopup from "../components/msgPopup";

function Library() {

  //const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [error, setError] = useState(null);


  const deleteData = async (id, type) => {
    try {
      const response = await fetch('http://localhost:80/readsync/backend/deleteData.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          id: id, 
          type: type
        })
      });
      const data = await response.json();
      /*
      if (data.result === "Book deleted successfully" || data.result === "Collection deleted successfully") {
        setDeleteSuccess(true);
      } else {
        setError(data.result);
      }*/
    } catch (err) {
      setError(err.message);
    }
  };

	return(
		<>
      {error && (<MsgPopup error={error} setError={setError}/>)}

			<ShowCollections deleteData={deleteData} />
			
		</>
	)
}

export default Library;