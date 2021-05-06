import React, { useEffect, useState, useRef } from "react";

export function Canvas() {
    const [isDrawing, setIsDrawing] = useState(false)
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
      canvas.style.background = "black";
  
      const context = canvas.getContext("2d")
      context.scale(2, 2);
      context.lineCap = "round";
      context.strokeStyle = "white";
      context.lineWidth = 5;
      contextRef.current = context;
    }, []);
  
    const startDrawing = ({ nativeEvent }) => {
        if (isDrawing) {
            setIsDrawing(false);
            return;
        }   

        console.log(nativeEvent);
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

        console.log(nativeEvent.touches[0]);
        const { clientX, clientY } = nativeEvent.touches[0];

        const canvas = canvasRef.current;
        const { offsetLeft, offsetTop } = recursiveOffsetLeftTop(canvas);

        contextRef.current.beginPath();
        contextRef.current.moveTo(clientX - offsetLeft, clientY - offsetTop);
        setIsDrawing(true);
    }   
  
    const finishDrawing = () => {
      contextRef.current.closePath();
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

  return (
    <canvas
      onMouseDown={startDrawing}
      onTouchStart={startDrawingWithTouch}
      onMouseUp={finishDrawing}
      onTouchEnd={finishDrawing}
      onMouseMove={draw}
      onTouchMove={drawWithTouch}
      ref={canvasRef}
    />
  );
}

