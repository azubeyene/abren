import React from 'react';

import "./DropHere.css";

//on click => trigger input 

const DropHere = (props) => {
    //comment 
    return ( 
        <div className="drop-image-upload"> 
            <input id="fileInputt" type="file" name="files[]" accept="image/*" onChange={props.onSelectImage} />
            <label htmlFor="fileInputt">
                {props.imageAddress.length>0 ? (
                    <div> 
                        <img src={props.imageAddress}/> 
                    </div> 
                ):(
                    <div className="drop-container">
                        <div>
                            <div className="upload-icon"></div>
                            <br/>
                            {"Click to upload image"}  
                        </div>
                    </div>
                )}
            </label>
            
        </div> 
    )
}
export default DropHere;