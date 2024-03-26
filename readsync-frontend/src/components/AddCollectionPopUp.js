

function AddCollectionPopUp({ childProps }){
    <div className="overlay">
        <div className="popup">
            <h3>Selecciona la colección a la que añadir el libro</h3>
            <span className="close-popup" onClick={() => 
            {if (childProps.collectionForm) {
                childProps.setCollectionForm(false);
            }
            childProps.setPopup(false);}}>X</span>
            <div className="popup-content">
                <button
                    onClick={() => {childProps.setForm(!childProps.form); childProps.setPopup(false)}}
                >Leídos</button>

            {childProps.collectionData && childProps.collectionData[0] && Array.isArray(childProps.collectionData[0].result) && childProps.collectionData[0].result.length > 0 && (
                    childProps.collectionData[0].result.map((data, index) => (
                            // miramos si data.nombre no es igual a "Leídos" para no mostrarla dos veces
                            childProps.data.nombre !== "Leídos" &&
                            <button 
                                    key={index}
                                    onClick={() => childProps.handleAddCollection("Existe", data.id_coleccion)}
                            >{data.nombre}</button>
                    ))
            )}

                {childProps.collectionForm ? <div className="collectionForm">
                    <input 
                    type="text"
                    name="collectionName"
                    value={childProps.collectionName}
                    onChange={(e)=> childProps.handleInputChange(e, "collectionName")}
                    placeholder="Nombre de la colección"/>

                    <input 
                        type="submit"
                        defaultValue="submit"
                        className='add-collection'
                        onClick={() => childProps.handleAddCollection("noExiste", childProps.data.id_coleccion)}
                        />
                    
                </div> : ""}
                {childProps.collectionForm ? ("") :<button onClick={() => childProps.setCollectionForm(!childProps.collectionForm)} className="add-collection">Añadir más colecciones</button>}
            </div>

        </div>
    </div>
}

export default AddCollectionPopUp;