import { useState } from "react";
import "../stylesheets/library.css";
import ShowCollections from "../components/ShowCollections";
import MsgPopup from "../components/MsgPopup";

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