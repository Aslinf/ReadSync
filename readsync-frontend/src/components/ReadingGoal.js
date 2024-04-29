import { useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import "../stylesheets/readingGoal.css"


function ReadingGoalForm({ user, error, setError, date }){
	const [readingGoal, setReadingGoal] = useState("");
	const readingGoalEndPoint = "http://localhost:80/readsync/backend/addReadingGoal.php";
	

	function handleInputChange(e){
		setReadingGoal(e.target.value);
	}

	function sendData(){
		var headers = {
			"Accept": "application/json",
			"Content-Type": "application/json"
		};

		var Data = {
			user: user,
			year: date,
			readingGoal: readingGoal
		}

		fetch(readingGoalEndPoint, {
			method: "POST",
			mode: "cors",
			headers: headers,
			body: JSON.stringify(Data)
		})
		.then((res) => {
			if (!res.ok) {
				throw new Error(`HTTP error! Status: ${res.status}`);
			}
			return res.json();
		})
		.then((res) => {
			setError(res[0].result);
		}).catch((err) =>{
			setError(err.message);
		});

		setReadingGoal("");
	}

	return(
		<>
			<form onSubmit={sendData} className="center">
				<div className="center">
					<label className="chart-title">¿Cuántos libros quieres leer este año?</label>
					<input type="number" className="reading-goal-input" onChange={(e) => handleInputChange(e)} value={readingGoal} />
					<button type="submit" className="reading-goal-submit">Enviar</button>
				</div>
			</form>
		</>
	);

}


function ReadingGoal({successfullReadingGoal, toggleReadingGoal, date, readingGoal, booksRead }){

	return(
		<>
			<div className="reading_goal_container center">
				<p className="chart-title">{`Objetivo de Lectura de ${date}`}</p>
				{successfullReadingGoal ? <p>¡Felicidades has conseguido tu objetivo!</p> : ""}
				<ProgressBar 
					completed={`${booksRead}`} 
					maxCompleted={readingGoal}
					className="progress_bar_container"
					animateOnRender={true}
					bgColor="#895845"
					baseBgColor="#eee5da"
					labelAlignment="center"
					ariaValuemax={readingGoal}
					ariaValuemin={0}
					ariaValuetext={booksRead}
				/>
				<button onClick={toggleReadingGoal}>Editar Objetivo</button>
			</div>
		</>
	)
		
		
}

export default ReadingGoalForm;
export {ReadingGoal};
    