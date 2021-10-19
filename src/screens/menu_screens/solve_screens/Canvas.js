import React, { useEffect, useState, useRef, useCallback } from "react";
import { IP_SERVER } from "../../../global/constats";
import Popup from "../../global_components/Popup";

const request = require("request-promise");

const Canvas = ({ history }) => {

  const [alertPopup, setAlertPopup] = useState(false);
  const [ currentError, setCurrentError ] = useState(null);

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

    const [isDrawing, setIsDrawing] = useState(false)
    const [ canvasHistory, setCanvasHistory ] = useState([new ImageData(window.innerWidth, window.innerHeight)]);

    const canvasRef = useRef(null);
    const contextRef = useRef(null);
  
    const recursiveOffsetLeftTop = (element) => {
        var offsetLeft = 0;
        var offsetTop = 0;
        while (element) {
            offsetLeft = element.offsetLeft;
            offsetTop = element.offsetTop;
            element = element.offsetParent;
        }

        return {
            offsetLeft, 
            offsetTop
        };
    }

    useEffect(() => {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = `${window.innerWidth/2}px`;
      canvas.style.height = `${window.innerHeight/2}px`;
      canvas.style.background = "white";
  
      const context = canvas.getContext("2d")

      context.scale(2, 2);
      context.lineCap = "round";
      context.strokeStyle = "black";
      context.lineWidth = 2;
      contextRef.current = context;
    }, []);
  
    const startDrawing = ({ nativeEvent }) => {
        if (isDrawing) {
            setIsDrawing(false);
            return;
        }   

        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const startDrawingWithTouch = ({ nativeEvent }) => {
        if (isDrawing) {
            setIsDrawing(false);
            return;
        }

        const { clientX, clientY } = nativeEvent.touches[0];

        const canvas = canvasRef.current;
        const { offsetLeft, offsetTop } = recursiveOffsetLeftTop(canvas);

        contextRef.current.beginPath();
        contextRef.current.moveTo(clientX - offsetLeft, clientY - offsetTop);
        setIsDrawing(true);
    }   
  
    const finishDrawing = () => {
      contextRef.current.closePath();
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d")

      var data = context.getImageData(0, 0, canvas.width, canvas.height);
      canvasHistory.push(data);
      console.log(canvasHistory.length);

      setIsDrawing(false);
    };
  
    const draw = ({ nativeEvent }) => {
      if (!isDrawing) {
        return;
      }
      const { offsetX, offsetY } = nativeEvent;
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    };

    const drawWithTouch = ({ nativeEvent }) => {
        if (!isDrawing) {
          return;
        }

        const { clientX, clientY } = nativeEvent.touches[0];
        const canvas = canvasRef.current;
        const { offsetLeft, offsetTop } = recursiveOffsetLeftTop(canvas);

        contextRef.current.lineTo(clientX - offsetLeft, clientY - offsetTop);
        contextRef.current.stroke();
    }

    const handleUndo = () => {
      if (canvasHistory.length === 1) {
        return;
      }

      var prevState = canvasHistory[canvasHistory.length - 2];
      canvasHistory.pop();
      
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.putImageData(prevState, 0, 0);
    }

    const handleDelete = () => {
      setCanvasHistory([new ImageData(window.innerWidth, window.innerHeight)]);
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.putImageData(canvasHistory[0], 0, 0);
    }

    const handleSend = useCallback(() => {
      var canvas = document.getElementById('canvas');
      var imgData = canvas.toDataURL();
      imgData = imgData.split("data:image/png;base64,")[1]
      const url = `http://${IP_SERVER}:4000/image/text`;
          postData(url, { image: imgData })
              .then(async data => {
                  console.log(data);
                  if (data.status === 'ok') {
                      const requestPreview = async () => {
                          const options = {
                              method: "POST",
                              uri: `http://${IP_SERVER}:4000/parse/latex`, 
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
    }, [history]);

  return (
    <>
      <canvas
        onMouseDown={startDrawing}
        onTouchStart={startDrawingWithTouch}
        onMouseUp={finishDrawing}
        onTouchEnd={finishDrawing}
        onMouseMove={draw}
        onTouchMove={drawWithTouch}
        ref={canvasRef}
        id="canvas"
      /><br></br><br></br>
      <div class="row justify-content-start">
        <div class="col-6 col-sm-1">
          <button className="btn btn-primary" onClick={ handleUndo }>Undo</button>
        </div>
        <div class="col-6 col-sm-1">
          <button className="btn btn-danger" onClick={ handleDelete }>Clear</button>
        </div>
        <div class="col-6 col-sm-1">
          <button className="btn btn-success" onClick={ handleSend }>Send</button>
        </div>
      </div>
      <Popup trigger={alertPopup} setTrigger={setAlertPopup}>
        <h3 style={{ color:"black" }}> Error </h3>
        <p style={{ color:"black" }}> { currentError } </p>
      </Popup>
    </>
  );
}

export default Canvas;

  