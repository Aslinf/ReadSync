
const ReadForm = ({ setForm, setPopup, handleInputChange, handleAddCollection, data }) => {
    return(
      <>
        <div className="overlay">
          <div className="popup">
            <h3>Completa el formulario</h3>
            <span className="close-popup" onClick={() => 
              {setForm(false);
              setPopup(true)}}>X</span>
            
              <div>
                <label> 
                  <input 
                  type="radio"
                  id="fisico"
                  name="formato"
                  value="Fisico"
                  onChange={(e)=> handleInputChange(e, "formFormat")}
                  /> Físico
                </label>

                <label> 
                  <input 
                  type="radio"
                  id="audio"
                  name="formato"
                  value="Audio libro"
                  onChange={(e)=> handleInputChange(e, "formFormat")}
                  /> Audio Libro
                </label>

                <label> 
                  <input 
                  type="radio"
                  id="digital"
                  name="formato"
                  value="Digital"
                  onChange={(e)=> handleInputChange(e, "formFormat")}
                  /> Digital
                </label>
              </div>
              <label for="calificacion">Calificación:</label>

              <select id="calificacion" name="calificacion" onChange={(e)=> handleInputChange(e, "formRating")}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>

              <textarea 
              onChange={(e)=> handleInputChange(e, "formComment")}/>
              
              <input 
								type="submit"
								defaultValue="submit"
								className='add-collection'
								onClick={() => handleAddCollection(data, "Leídos")}
							/>
              
         
        </div>
        </div>
      </>
    )
  }
  
  export default ReadForm;