import { useEffect, useState } from "react";
import { PolarArea } from "react-chartjs-2";

function BookCategories({ bookCategories }) {

	const [allGenresData, setAllGenresData] = useState([]);
	const [allGenresLabels, setAllGenresLabels] = useState([]);

	const [leidosGenresData, setLeidosGenresData] = useState([]);
	const [leidosGenresLabels, setLeidosGenresLabels] = useState([]);

	useEffect(() => {
		const getData = () => {
			if(Array.isArray(bookCategories[0]?.all_collections) && bookCategories.length > 0){
				const allDataLabels = [];
				const allData = [];
				bookCategories[0].all_collections.forEach(({genre, count}) => {
					allDataLabels.push(genre);
					allData.push(count);
				});
			setAllGenresData(allData);
			setAllGenresLabels(allDataLabels);
			
			const leidosDataLabels = [];
			const leidosData = [];
			bookCategories[0].leidos_collection.forEach(({genre, count}) => {
				leidosDataLabels.push(genre);
				leidosData.push(count);
			});
			setLeidosGenresData(leidosData);
			setLeidosGenresLabels(leidosDataLabels);
			}
		};

	getData();
	}, [bookCategories])


	const colors= ['#f9f6f3', '#e4d4c4', '#d2b89f', '#bf9678', '#b27e5d', '#a46c52', '#895845', '#6f483d', '#5b3c33', '#301f1a'];

	return(
		<>
		<div className="book-categories">
			{allGenresData.length > 0 && (
				<div className="charts center">
					<p className="chart-title ">Géneros en biblioteca: </p>
					<PolarArea
						data={{
							labels: allGenresLabels,
							datasets: [
								{
									label: "Generos",
									data: allGenresData,
									backgroundColor: colors
								},
							]
						}}
						height="500px"
						width="500px"
					/>
				</div>
			)}

			{leidosGenresData.length > 0 && (
				<div className="charts center">
					<p className="chart-title ">Géneros leídos:</p>
					<PolarArea
						data={{
							labels: leidosGenresLabels,
							datasets: [
								{
									label: "Generos",
									data: leidosGenresData,
									backgroundColor: colors
								},
							]
						}}
						height="500px"
						width="500px"
					/>
				</div>
			)}
		</div>
		</>
	)
}

export default BookCategories;