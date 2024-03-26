import { Chart as ChartJS } from "chart.js/auto";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";


const BookAuthors = ({ bookAuthorData }) => {
	//console.log(bookAuthorData);
	const [authorsData, setAuthorsData] = useState([]);
	const [authorsDataLabel, setAuthorsDataLabel] = useState([]);

	useEffect(() => {
		const getData = () => {
				const dataLabels = [];
				const data = [];
				bookAuthorData[0].forEach(([author, number]) => {
						dataLabels.push(author);
						data.push(number);
				});
			setAuthorsData(data);
			setAuthorsDataLabel(dataLabels);
		};

	getData();
	}, [bookAuthorData])

	const colors= ['#f9f6f3', '#e4d4c4', '#d2b89f', '#bf9678', '#b27e5d', '#a46c52', '#895845', '#6f483d', '#5b3c33', '#301f1a'];
	
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