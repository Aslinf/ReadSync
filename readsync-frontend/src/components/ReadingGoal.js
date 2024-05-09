import { useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import "../stylesheets/readingGoal.css"

/*
function ReadingGoalForm({ user, error, setError, date, getData }){
	const [readingGoal, setReadingGoal] = useState("");
	const readingGoalEndPoint = "https://readsync.uabcilab.cat/backend/addReadingGoal.php";
	

	function handleInputChange(e){
		setReadingGoal(e.target.value);
	}

	async function sendData(e){
		e.preventDefault();
		try {
            const headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            };

            const data = {
                user: user,
                year: date,
                readingGoal: readingGoal
            };

            const response = await fetch(readingGoalEndPoint, {
                method: "POST",
                mode: "cors",
                headers: headers,
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setError(result[0].result);

            getData();
        } catch (err) {
            setError(err.message);
        }

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
*/

function ReadingGoalForm({ user, error, setError, date, setReadingGoalData, toggleReadingGoal }) {
    const [readingGoal, setReadingGoal] = useState("");
    const readingGoalEndPoint = "https://readsync.uabcilab.cat/backend/addReadingGoal.php";

    function handleInputChange(e) {
        setReadingGoal(e.target.value);
    }

    async function sendData(e) {
        e.preventDefault();

        try {
            const headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            };

            const data = {
                user: user,
                year: date,
                readingGoal: readingGoal
            };

            const response = await fetch(readingGoalEndPoint, {
                method: "POST",
                mode: "cors",
                headers: headers,
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setError(result[0].result);

            const updatedReadingGoalData = await fetchReadingGoalData();
            setReadingGoalData(updatedReadingGoalData);

			toggleReadingGoal();
        } catch (err) {
            setError(err.message);
        }

        setReadingGoal("");
    }


    async function fetchReadingGoalData() {
        try {
            const urlReadingGoal = new URL("https://readsync.uabcilab.cat/backend/getReadingGoal.php");
            urlReadingGoal.searchParams.append('user', user);
            const response = await fetch(urlReadingGoal, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const json = await response.json();
            return json;
        } catch (err) {
            setError(err.message);
            return [];
        }
    }

    return (
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
    
    