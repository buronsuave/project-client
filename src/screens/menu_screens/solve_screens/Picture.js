import React, { useState, useCallback, useEffect, useRef } from "react";
import Navbar from "../../menu_components/Navbar";
import Popup from "../../global_components/Popup";

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

    const [alertPopup, setAlertPopup] = useState(false);
    const [currentError, setCurrentError] = useState(null);

    const videoRef = useRef(null);
    const photoRef = useRef(null);
    var hasPic = false;


    const getVideo = () => {
        navigator.mediaDevices.getUserMedia({
            video: { width: 250, height: 250 }
        }).then(stream => {
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
        }).catch(err => {
            console.error(err);
        })
    }

    useEffect(() => {
        getVideo();
    }, [videoRef]);

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
                                            setAlertPopup(true)
                                            setCurrentError(res.status)
                                        } else {
                                            history.push(`/preview/${res.equation}`);
                                        }
                                    }

                                    await requestPreview();
                                }
                            });
                    }
                    reader.readAsDataURL(imageFile.files[0]);
                } else {
                    var canvas = document.getElementById('picture');
                    var imgData = canvas.toDataURL();
                    imgData = imgData.split("data:image/png;base64,")[1]
                    if (!hasPic) {
                        setAlertPopup(true)
                        setCurrentError("Please upload a file or take a picture")
                        return;
                    }

                    const url = "http://127.0.0.1:4000/image/text";
                    postData(url, { image: imgData })
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
                                        setAlertPopup(true)
                                        setCurrentError(res.status)
                                    } else {
                                        history.push(`/preview/${res.equation}`);
                                    }
                                }

                                await requestPreview();
                            }
                        });
                }
            } catch (error) {
                setAlertPopup(true)
                setCurrentError(error)
            }
        }, [history, hasPic]
    )

    const takePhoto = () => {
        const width = 250;
        const height = 250;

        let video = videoRef.current;
        let photo = photoRef.current;

        photo.width = width;
        photo.height = height;

        let context = photo.getContext('2d');
        context.drawImage(video, 0, 0, width, height);

        hasPic = true;
    }

    return (
        <div>
            <Navbar />
            <div className="jumbotron">
                <h1>Solve by Picture</h1>
                <form onSubmit={handleSendPicture}>
                    <fieldset>
                        <div className="form-group">
                            <label>Select picture</label>
                            <input type="file" className="form-control-file" name="image" aria-describedby="fileHelp" id="file" />
                            <small id="fileHelp" className="form-text text-muted">
                                Please select an image from the gallery or take a photo to continue
                            </small><br></br>
                            <video ref={videoRef}></video><br></br>
                            <button type="button" className="btn btn-secondary" onClick={takePhoto}>Take Picture</button><br></br><br></br>
                            <canvas id="picture" ref={photoRef}></canvas><br></br><br></br>
                            <button type="submit" className="btn btn-primary">Send image</button>
                        </div>
                    </fieldset>
                </form>
            </div>
            <Popup trigger={alertPopup} setTrigger={setAlertPopup}>
                <h3 style={{ color: "black" }}> Error </h3>
                <p style={{ color: "black" }}> {currentError} </p>
            </Popup>
        </div>
    )
}

export default Picture;