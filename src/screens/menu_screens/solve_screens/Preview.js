import React, { useState, useContext } from 'react'
import { useParams } from 'react-router'

import Navbar from "../../menu_components/Navbar";
import app from "../../../base";
import { AuthContext } from "../../../auth";
import { WaitingScreen } from '../../../alerts/WaitingScreen';
import { GenericAnomaly } from '../../../anomalies/GenericAnomaly'
import { SolutionTimeoutAnomaly } from '../../../anomalies/SolutionTimeoutAnomaly'
import { CompletenessAnomaly } from '../../../anomalies/CompletenessAnomaly';
import { ClassificationAnomaly } from '../../../anomalies/ClassificationAnomaly';

const request = require("request-promise");
const MathJax = require('react-mathjax');

const Preview = () => {
    const { currentUser } = useContext(AuthContext);
    const { equation } = useParams();
    const [ solution, setSolution ] = useState([]);
    const [ showLatex, setShowLatex ] = useState(false);

    const [ isWaiting, setIsWaiting ] = useState(false);
    const [ hasGenericAnomaly, setHasGenericAnomaly ] = useState(false);
    const [ hasCompletenessAnomaly, setHasCompletenessAnomaly ] = useState(false);
    const [ hasClassificationAnomaly, setHasClassificationAnomaly ] = useState(false);

    const [ genericAnomalyText, setGenericAnomalyText ] = useState(null);
    const [ completenessAnomalyText, setCompletenessAnomalyText ] = useState(null);
    const [ classificationAnomalyText, setClassificationAnomalyText ] = useState(null);
    const [ isOnTimeout, setIsOnTimeout ] = useState(false);

    const send = equation.replace("%2F", "/");

    const addEquation = async (equation) => {
        const db = app.firestore();
        const uid = currentUser.uid;

        const newEquation = {
            date: new Date().toString().split("GMT")[0],
            equation: equation,
            pinned: false
        }

        await db.collection('users').doc(uid).collection('equations').doc().set({
            ...newEquation
        });
    }

    const handleSubmit = async () => {
        const options = {
            method: "POST",
            uri: `http://127.0.0.1:4000/solve`,
            body: { equation: send },
            json: true
        };

        await addEquation(send)
        var flagWait = true;
        setIsWaiting(true);

        const res = request(options);
        
        setTimeout(() => {
            if (flagWait) {
                res.abort()
                setIsWaiting(false)
                setIsOnTimeout(true)
            }
        }, 30000)

        // Catch the response from the server in body object
        res.then(body => {
            
            setIsWaiting(false)
            flagWait = false
            if (body.status !== 'ok') {

                // Classification error
                if (body.exception === 'classification') {
                    setClassificationAnomalyText(body.status)
                    setIsOnTimeout(false);
                    setHasGenericAnomaly(false);
                    setHasCompletenessAnomaly(false);
                    setHasClassificationAnomaly(true);

                // Completeness error
                } else if (body.exception === 'completeness') {
                    setCompletenessAnomalyText(body.status);
                    setIsOnTimeout(false);
                    setHasGenericAnomaly(false);
                    setHasCompletenessAnomaly(true);
                    setHasClassificationAnomaly(false);

                    var solutionAuxCom = []
                    const aux = body.solution.replaceAll("'", "\"")
                    const jsonSolve = JSON.parse(aux)
                    for (let index = 0; index < jsonSolve.length; index++) {
                        const step = jsonSolve[index];
                        const stepHeader = step[0]
                        var stepLatexInc = ""
                        for (let j = 0; j < step[1].length; j++) {
                            stepLatexInc += step[1][j];
                        }
                        const stepObject = { latex: stepLatexInc, header: stepHeader }
                        solutionAuxCom.push(stepObject)
                    }
                    setSolution(solutionAuxCom);

                // Unexpected error
                } else if (body.exception === 'generic') {
                    setGenericAnomalyText(body.status);
                    setIsOnTimeout(false);
                    setHasGenericAnomaly(true);
                    setHasCompletenessAnomaly(false);
                    setClassificationAnomalyText(false);
                }
            
            // No Anomaly in solution
            } else {
                var solutionAux = []
                const aux = body.solution.replaceAll("'", "\"")
                const jsonSolve = JSON.parse(aux)
                for (let index = 0; index < jsonSolve.length; index++) {
                    const step = jsonSolve[index];
                    const stepHeader = step[0]
                    var stepLatex = ""
                    for (let j = 0; j < step[1].length; j++) {
                        stepLatex += step[1][j];
                    }
                    const stepObject = { latex: stepLatex, header: stepHeader }
                    solutionAux.push(stepObject)
                }
                setSolution(solutionAux);
            }
        })
    }

    const removeSpecialLatex = (input) => {
        return input.replaceAll("$", "")
    }

    const getText = (input) => {
        return input.replace("\\mathtt{\\text{-", "").replace("}}\\\\ \\\\", "")
    }

    const getLaTeX = () => {
        var latex = "";
        for (let i = 0; i < solution.length; i++) {
            latex += solution[i].header;
            latex += solution[i].latex;
        }
        return latex;
    }

    const printLaTeX = () => {
        setShowLatex(!showLatex)
    }

    const renderLaTeXBox = () => {
        if (showLatex) {
            return (
                <div>
                    <textarea readOnly className="form-control" style={{ height: "300px" }}>{getLaTeX()}</textarea>
                </div>
            )
        }
    }

    const renderSolve = () => {
        if (solution.length !== 0) {
            var i = 1;
            return solution.map(step => (
                <div>
                    <br></br>
                    <h4>
                        Step {i}:
                        {getText(step.header)}
                        {(() => { i++ })()}
                    </h4><br></br>
                    <MathJax.default.Provider>
                        <MathJax.default.Node inline formula={removeSpecialLatex(step.latex)} />
                    </MathJax.default.Provider>
                </div>
            ))
        }
    }

    const renderLaTeXButton = () => {
        if (solution.length > 0) {
            if (!showLatex) {
                return (
                    <div>
                        <button onClick={printLaTeX} type="button" className="btn btn-success">Get LaTeX</button>
                        <br></br>
                        <br></br>
                    </div>
                )
            }
            return (
                <div>
                    <button onClick={printLaTeX} type="button" className="btn btn-danger">Hide LaTeX</button>
                    <br></br>
                    <br></br>
                </div>
            )
        }
    }

    const renderLaTeXPdfButton = () => {
        if (solution.length > 0) {
            return (
                <div>
                    <button onClick={handleLatexToPdf} type="button" className="btn btn-warning">Export to PDF</button>
                    <br></br>
                    <br></br>
                </div>
            )
        }
    }

    const handleLatexToPdf = () => {        
        // var latexCode = "" + 
        // "\\documentclass{article}" +
        // "\\begin{document}" +
        // "\\LaTeX is great!" +
        // "$E = mc^2$" +
        // "\\end{document}";
        // try {
        //     (new pdftex().compile(latexCode)).then((pdf) => { console.log(pdf) })
        // } catch (e) {
        //     alert(e)
        // }
    }

    return (
        <div>
            <Navbar />
            <div className="jumbotron">
                <h1>Equation Preview</h1>
                <br></br>
                <h3>
                    <MathJax.default.Provider>
                        <MathJax.default.Node inline formula={send} />
                    </MathJax.default.Provider>
                </h3><br></br>
                <button onClick={handleSubmit} type="button" className="btn btn-primary">Solve</button><br></br>
                <br></br>
                <div id="solve">
                    {renderSolve()}
                </div>
                {renderLaTeXButton()}
                {renderLaTeXBox()}
                {renderLaTeXPdfButton()}
            </div>
            { new WaitingScreen(isWaiting, setIsWaiting).display() }
            { new GenericAnomaly(genericAnomalyText, hasGenericAnomaly, setHasGenericAnomaly).display() }
            { new SolutionTimeoutAnomaly(isOnTimeout, setIsOnTimeout).display() }
            { new ClassificationAnomaly(classificationAnomalyText, hasClassificationAnomaly, setHasClassificationAnomaly).display() }
            { new CompletenessAnomaly(completenessAnomalyText, hasCompletenessAnomaly, setHasCompletenessAnomaly).display() }
        </div>
    )
}

export default Preview;

