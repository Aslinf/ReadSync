import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

const BooksFormats = ({ bookFormatData }) => {

	const [formatsData, setFormatsData] = useState([]);

	useEffect(() => {
		//conseguimos los datos de los formatos leídos
		const data = [0, 0, 0];
		const getData = () => {
			bookFormatData[0].forEach(([format, number]) => {
				switch(format){
					case "Fisico":
						data[0] = number;
						break;
					case "Digital":
						data[1] = number;
						break;
					case "Audio libro":
						data[2] = number;
						break;
				}
			});
			setFormatsData(data)
		};

	getData();
	}, [bookFormatData])

	
	return(
		<>
			<div className="book-format center">
				<p className="chart-title ">Formatos más leídos: </p>
				<Bar 
					data={{
						labels: ['Físico', 'Digital', 'Audio libro'],
						datasets: [
							{
							label: "Formatos",
							data: formatsData,
							backgroundColor: [
								'#bf9678'
							]
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

export default BooksFormats;