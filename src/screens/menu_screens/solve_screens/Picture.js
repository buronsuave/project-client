import React, { useCallback } from "react";
import Navbar from "../../menu_components/Navbar";
const request = require("request-promise");

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST', 
      mode: 'cors', 
      cache: 'no-cache', 
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    
    return response.json(); 
  }

const Picture = ({ history }) => {
    const handleSendPicture = useCallback(
        async event => {
            event.preventDefault();
            try {
                var imageFile = document.getElementById("file");
                if (imageFile.files.length > 0) {
                    var reader = new FileReader();
                    reader.onload = (e) => {
                        var image64 = e.target.result;
                        image64 = image64.split("data:image/png;base64,")[1]
                        
                        const url = "http://127.0.0.1:4000/image/text";
                        postData(url, { image: image64 })
                            .then(async data => {
                                console.log(data);
                                if (data.status === 'ok') {
                                    const requestPreview = async () => {
                                        const options = {
                                            method: "POST",
                                            uri: `http://127.0.0.1:4000/parse/latex`, 
                                            body: { equation: data.text }, 
                                            json: true
                                        };
                                        const res = await request(options);
                                        if (res.status !== 'ok') {
                                            alert(res.status);
                                        } else {
                                            history.push(`/preview/${res.equation}`);
                                        }
                                    }

                                    await requestPreview();
                                }
                            });
                    }
                    
                    reader.readAsDataURL(imageFile.files[0]);
                }   
            } catch (error)
            {
                alert(error);
            }
        }, [history]
    )

    return (
        <div>
            <Navbar />
            <div className="jumbotron">
                <h1>Solve by Picture</h1>
                <form onSubmit={handleSendPicture}>
                    <fieldset>
                        <div className="form-group">
                            <label>Select picture</label>
                            <input type="file" className="form-control-file" name="image" aria-describedby="fileHelp" id="file"/>
                            <small id="fileHelp" className="form-text text-muted">This is some placeholder block-level help text for the above input. It's a bit lighter and easily wraps to a new line.</small>
                            <button type="submit" className="btn btn-primary">Send image</button><br></br>
                        </div>    
                    </fieldset>
                </form>
            </div>
        </div>
    )
}

export default Picture;