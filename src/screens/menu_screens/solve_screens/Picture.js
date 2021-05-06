import React, { useCallback } from "react";
import Navbar from "../../menu_components/Navbar";

const https = require("https");
const options = {
    hostname: "localhost", 
    port: 4001, 
    path: "/", 
    method: "POST", 
    headers: {
        'Content-Type': 'application/json'
    }
}

const Picture = ({ history }) => {
    const handleSendPicture = useCallback(
        async event => {
            event.preventDefault();
            try {
                var imageFile = document.getElementById("file");
                if (imageFile.files.length) {
                    var reader = new FileReader();
                    reader.onload = (e) => {
                        var image = e.target.result;
                        var image64 = new Buffer(image).toString("base64");
                        console.log(image64);

                        var data = JSON.stringify({
                            image: image64
                        })

                        const req = https.request(options, res => {
                            console.log(`statusCode: ${res.statusCode}`);

                            res.on("data", d => {
                                console.log(d);
                            });
                        })

                        req.on("error", e => {
                            console.log(e);
                        });

                        req.write(data);
                    }
                    
                    reader.readAsBinaryString(imageFile.files[0]);
                }   
                // const image_base64 = new Buffer(image).toString("base64");
                // const data = {
                //     image: image_base64
                // }  
                
                // const req = https.request(options, res => {
                //     console.log(`status code: ${res.statusCode}`);

                //     res.on('data', d => {
                //         console.log(d);
                //         return <Redirect to={{
                //             pathname: "../result",
                //             state: { res: res }
                //         }} />
                //     })

                //     res.on('error', e => {
                //         console.log(e);
                //     })
                // });

                // req.write(data);
                // req.end();

            } catch (error)
            {
                alert(error);
            }
        }, []
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