import React, { useState } from 'react';
import { InterpretationAnomaly } from '../../../anomalies/InterpretationAnomaly';
import { IP_SERVER } from '../../../global/constats';

const request = require("request-promise");

const MathKeyboard = ({ history }) => {

    const [alertPopup, setAlertPopup] = useState(false);
    const [ currentError, setCurrentError ] = useState(null);

    const writeChar = (char) => {
        return () => {
            const equationBox = document.getElementById("equationBox");
            var index = equationBox.value.indexOf("|");
            var left = equationBox.value.substring(0, index);
            var right = equationBox.value.substring(index, equationBox.value.length);
            equationBox.value = left + char + right;
        }
    }

    const clear = () => {
        const equationBox = document.getElementById("equationBox");
        equationBox.value = "|";
    }

    const remove = () => {
        const equationBox = document.getElementById("equationBox");
        var index = equationBox.value.indexOf("|");
        if (index > 0) {
            var left = equationBox.value.substring(0, index-1);
            var right = equationBox.value.substring(index, equationBox.value.length);
            equationBox.value =  left + right;
        }
    }

    const moveLeft = () => {
        const equationBox = document.getElementById("equationBox");

        var index = equationBox.value.indexOf("|");
        if (index > 0) {
            var left = equationBox.value.substring(0, index - 1);
            var right = equationBox.value.substring(index - 1, equationBox.value.length).replace("|", "");
            equationBox.value = left + "|" + right; 
        }
    }

    const moveRight = () => {
        const equationBox = document.getElementById("equationBox");

        var index = equationBox.value.indexOf("|");
        if (index < equationBox.value.length-1) {
            var left = equationBox.value.substring(0, index + 2).replace("|", "");
            var right = equationBox.value.substring(index + 2);
            equationBox.value = left + "|" + right; 
        }
    }

    const handleSubmit = async () => {
        const equationBox = document.getElementById("equationBox");
        const equation = equationBox.value.replace("|", "");

        const options = {
            method: "POST",
            uri: `http://${IP_SERVER}/parse/latex`, 
            body: { equation: equation }, 
            json: true
        };

        console.log(options);
        
        const res = await request(options);
        if (res.status !== 'ok') {
            setAlertPopup(true)
            setCurrentError(res.status)
        } else {
            history.push(`/preview/${res.equation}`);
        }
    }

    const keydownCallback = e => {
        const keyName = e.key;
        switch(keyName) {
            case "0" : writeChar("0")(); break;
            case "1" : writeChar("1")(); break;
            case "2" : writeChar("2")(); break;
            case "3" : writeChar("3")(); break;
            case "4" : writeChar("4")(); break;
            case "5" : writeChar("5")(); break;
            case "6" : writeChar("6")(); break;
            case "7" : writeChar("7")(); break;
            case "8" : writeChar("8")(); break;
            case "9" : writeChar("9")(); break;

            case "(" : writeChar("(")(); break;
            case ")" : writeChar(")")(); break;
            case "," : writeChar(",")(); break;
            case "." : writeChar(".")(); break;
            case "D" : writeChar("D")(); break;
            case "Backspace" : remove(); break;
            case "^" : writeChar("^")(); break;
            case "+" : writeChar("+")(); break;
            case "-" : writeChar("-")(); break;
            case "*" : writeChar("*")(); break;
            case "/" : writeChar("/")(); break;
            case "=" : writeChar("=")(); break;

            case "x" : writeChar("x")(); break;
            case "y" : writeChar("y")(); break;
            case "E" : writeChar("E")(); break;
            case "p" : writeChar("pi")(); break;

            case "s" : writeChar("sin")(); break;
            case "S" : writeChar("sec")(); break;
            case "c" : writeChar("cos")(); break;
            case "C" : writeChar("csc")(); break;
            case "t" : writeChar("tan")(); break;
            case "T" : writeChar("cot")(); break;
            case "l" : writeChar("ln")(); break;
            case "r" : writeChar("sqrt")(); break;

            case "ArrowLeft" : moveLeft(); break;
            case "ArrowRight" : moveRight(); break;
            case "Delete" : clear(); break;
            case "Enter": handleSubmit(); break;

            default: break;
        }
    }

    return (
        <div onKeyDown={ keydownCallback }>
            <input defaultValue="|" disabled type="text" className="form-control" placeholder="Equation" name="equationBox" id="equationBox"
            onClick = { () => { document.getElementById("equationBox").addEventListener("keydown", keydownCallback) } }
            /><br/>
            <div className="row">
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-primary btn-lg btn-block" onClick={ clear }>Clear</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-danger btn-lg btn-block" onClick={ writeChar("7") }>7</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-danger btn-lg btn-block" onClick={ writeChar("8") }>8</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-danger btn-lg btn-block" onClick={ writeChar("9") }>9</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-light btn-lg btn-block" onClick={ writeChar("sin") }>sin</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-info btn-lg btn-block" onClick={ writeChar("+") }>+</button>
                </div>
            </div><br/>

            <div className="row">
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-primary btn-lg btn-block" onClick={ remove }>Remove</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-danger btn-lg btn-block" onClick={ writeChar("4") }>4</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-danger btn-lg btn-block" onClick={ writeChar("5") }>5</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-danger btn-lg btn-block" onClick={ writeChar("6") }>6</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-light btn-lg btn-block" onClick={ writeChar("cos") }>cos</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-info btn-lg btn-block" onClick={ writeChar("-") }>-</button>
                </div>
            </div><br/>

            <div className="row">
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-primary btn-lg btn-block" onClick={ moveLeft }>
                        <i className="fa fa-arrow-left"></i>
                    </button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-danger btn-lg btn-block" onClick={ writeChar("1") }>1</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-danger btn-lg btn-block" onClick={ writeChar("2") }>2</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-danger btn-lg btn-block" onClick={ writeChar("3") }>3</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-light btn-lg btn-block" onClick={ writeChar("tan") }>tan</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-info btn-lg btn-block" onClick={ writeChar("*")}>*</button>
                </div>
            </div><br/>

            <div className="row">
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-primary btn-lg btn-block" onClick={ moveRight }>
                        <i className="fa fa-arrow-right"></i>
                    </button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-danger btn-lg btn-block" onClick={ writeChar("0") }>0</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-danger btn-lg btn-block" onClick={ writeChar(".") }>.</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-secondary btn-lg btn-block" onClick={ writeChar("D") }>D</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-light btn-lg btn-block" onClick={ writeChar("sec") }>sec</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-info btn-lg btn-block" onClick={ writeChar("/") }>/</button>
                </div>
            </div><br/>

            <div className="row">
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-warning btn-lg btn-block" onClick={ writeChar(",") }>,</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-success btn-lg btn-block" onClick={ writeChar("x") }>x</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-success btn-lg btn-block" onClick={ writeChar("E") }>E</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-secondary btn-lg btn-block" onClick={ writeChar("ln") }>ln</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-light btn-lg btn-block" onClick={ writeChar("csc") }>csc</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-info btn-lg btn-block" onClick={ writeChar("^") }>^</button>
                </div>
            </div><br/>

            <div className="row">
                <div className="col-6 col-sm-1">
                    <button type="button" className="btn btn-warning btn-lg btn-block" onClick={ writeChar("(") }>(</button>
                </div>
                <div className="col-6 col-sm-1">
                    <button type="button" className="btn btn-warning btn-lg btn-block" onClick={ writeChar(")") }>)</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-success btn-lg btn-block" onClick={ writeChar("y") }>y</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-success btn-lg btn-block" onClick={ writeChar("pi") }>pi</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-secondary btn-lg btn-block" onClick={ writeChar("sqrt") }>sqrt</button>
                </div>
                <div className="col-6 col-sm-2">
                    <button type="button" className="btn btn-light btn-lg btn-block" onClick={ writeChar("cot") }>cot</button>
                </div>
                <div className="col-6 col-sm-1">
                    <button type="button" className="btn btn-info btn-lg btn-block" onClick={ writeChar("=") }>=</button>
                </div>
                <div className="col-6 col-sm-1">
                    <button type="button" className="btn btn-primary btn-lg btn-block" onClick={ handleSubmit }>
                        <i className="fa fa-check"></i>
                    </button>
                </div>
            </div><br/>
            { new InterpretationAnomaly(currentError, alertPopup, setAlertPopup).display() }
        </div>
    );
}

export default MathKeyboard;