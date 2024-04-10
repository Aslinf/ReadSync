import { Chart as ChartJS } from "chart.js/auto";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";


const BookAuthors = ({ bookAuthorData }) => {
	const [authorsData, setAuthorsData] = useState([]);
	const [authorsDataLabel, setAuthorsDataLabel] = useState([]);

	const [colors, setColors] = useState([]);

	function randomColor(array){
		for(let i = 0; i < array.length; i++){
			colors.push('#'+Math.floor(Math.random()*16777215).toString(16));
		}
	}

	useEffect(() => {
		const getData = () => {
				const dataLabels = [];
				const data = [];
				bookAuthorData[0].forEach(([author, number]) => {
						dataLabels.push(author);
						data.push(number);
				});
			randomColor(data);
			setAuthorsData(data);
			setAuthorsDataLabel(dataLabels);
		};
	getData();
	}, [bookAuthorData]);

	console.log(colors);

	return(
		<>
		<div className="book-authors center">
			<p className="chart-title ">Autores más leídos: </p>
			<Doughnut
				data={{
					labels: authorsDataLabel,
					datasets: [
						{
							label: "Autores",
							data: authorsData,
							backgroundColor: colors,
						},
					],
				}}
				height="500px"
				width="500px"

				/>
		</div>
		</>
	)
}

export default BookAuthors;