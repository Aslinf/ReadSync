import ReactStars from "react-rating-stars-component";
import "../stylesheets/book.css";


const ReadForm = ({ setForm, setPopup, handleInputChange, handleAddCollection, data }) => {
    
  const ratingChanged = (newRating) => {
    console.log(newRating)
    handleInputChange(newRating, "formRating");
  };
  
  return(
      <>
        <div className="overlay">
          <div className="popup">
            <h3>Completa el formulario</h3>
            <span className="close-popup" onClick={() => 
              {setForm(false);
              setPopup(true)}}>X</span>

            <label for="calificacion">Calificación:</label>
            <ReactStars 
              count={5}
              size={40}
              value={0}
              isHalf={true}
              color={"#e4d4c4"}
              activeColor={"#895845"}

              onChange={ratingChanged}
            />
            
            <div className="add-leidos-form-content">
              <div className="form-content-format">
                <div className="format-form-option">
              
                  <input 
                      type="radio"
                      id="fisico"
                      name="formato"
                      value="Fisico"
                      onChange={(e)=> handleInputChange(e, "formFormat")}
                  /> 
                  <label> Físico </label>
                </div>
                
                <div className="format-form-option">
                  
                  <input 
                    type="radio"
                    id="audio"
                    name="formato"
                    value="Audio libro"
                    onChange={(e)=> handleInputChange(e, "formFormat")}
                  />
                  <label>Audio Libro</label>
                </div>
                
                <div className="format-form-option">
                  
                  <input 
                    type="radio"
                    id="digital"
                    name="formato"
                    value="Digital"
                    onChange={(e)=> handleInputChange(e, "formFormat")}
                  />
                  <label>Digital</label>
                </div>
                
              </div>
              

              <textarea 
              placeholder="Escribe un comentario"
              onChange={(e)=> handleInputChange(e, "formComment")}/>
            </div>
              
            <input 
              type="submit"
              defaultValue="submit"
              className='add-collection-button center'
              onClick={() => handleAddCollection("Leídos", data.id_coleccion)}
            />
          </div>
        </div>
      </>
    )
  }
  
  export default ReadForm;