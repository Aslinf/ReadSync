import { useState } from "react";
import "../stylesheets/library.css";
import ShowCollections from "../components/ShowCollections";
import MsgPopup from "../components/MsgPopup";

function Library() {

  const [error, setError] = useState(null);

	return(
		<>
      {error && (<MsgPopup error={error} setError={setError}/>)}

			<ShowCollections />
			
		</>
	)
}

export default Library;