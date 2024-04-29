import '../stylesheets/book.css'

function MsgPopup({ error, setError }){

	error && (
		setTimeout(() => {
			setError(null); 
		}, 3000)
	)

	return(
		<>
			<div className="popup-msg">
				<span>{`${error}`}</span> 
			</div>

		</>

	)
}

export default MsgPopup;