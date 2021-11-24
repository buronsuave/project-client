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
import { IP_SERVER } from '../../../global/constats';

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
    const [ downloadButtonVisibility, setDownloadButtonVisibility ] = useState(false);
    const [ pdfContent, setPdfContent ] = useState(null);
    const [ latexForRender ] = useState([]);

    var userKind = null;

    const send = equation.replace("%2F", "/");

    const addEquation = async (equation) => {
        const db = app.firestore();
        const uid = currentUser.uid;

        const newEquation = {
            date: new Date().toString().split("GMT")[0],
            equation: equation,
            pinned: false
        }

        const fetchData = async () => {
            db.collection("users").onSnapshot((querySnapshot) => {
                const docs = []
                querySnapshot.forEach((doc) => {
                    if (doc.id === uid) {
                        docs.push({ ...doc.data(), id: doc.id });
                    }
                });

                try {
                    userKind = docs[0].type;
                } catch (someError) {
                    setHasGenericAnomaly(true)
                    setGenericAnomalyText("Error getting the user type")
                }
            })
        }

        await fetchData()
        await db.collection('users').doc(uid).collection('equations').doc().set({
            ...newEquation
        });
    }

    const handleSubmit = async () => {
        await addEquation(send)
        const options = {
            method: "POST",
            uri: `http://${IP_SERVER}/solve`,
            body: { equation: send, type: userKind },
            json: true
        };

        console.log(options)

        var flagWait = true;
        setIsWaiting(true);

        console.log(options.body)
        const res = request(options);
        
        setTimeout(() => {
            if (flagWait) {
                res.abort()
                setIsWaiting(false)
                setIsOnTimeout(true)
            }
        }, 60000)

        // Catch the response from the server in body object
        res.then(body => {
            // Update waiting status flags
            setIsWaiting(false)
            flagWait = false
            if (body.status !== 'ok') {

                // Classification error
                if (body.exception === 'classification') {
                    // Anomaly flags and messages
                    setClassificationAnomalyText(body.status)
                    setIsOnTimeout(false);
                    setHasGenericAnomaly(false);
                    setHasCompletenessAnomaly(false);
                    setHasClassificationAnomaly(true);

                    // Set partial solution
                    deserializeSolution(body.solution)

                // Completeness error
                } else if (body.exception === 'completeness') {
                    // Anomaly flags and messages
                    setCompletenessAnomalyText(body.status);
                    setIsOnTimeout(false);
                    setHasGenericAnomaly(false);
                    setHasCompletenessAnomaly(true);
                    setHasClassificationAnomaly(false);

                    // Set partial solution
                    deserializeSolution(body.solution)

                // Unexpected error
                } else if (body.exception === 'generic') {
                    // Anomaly flags and messages
                    setGenericAnomalyText(body.status);
                    setIsOnTimeout(false);
                    setHasGenericAnomaly(true);
                    setHasCompletenessAnomaly(false);
                    setClassificationAnomalyText(false);
                }
            
            // No Anomaly in solution
            } else {
                // Set solution
                deserializeSolution(body.solution)
            }
        })
    }

    const getText = (input) => {
        return input.replace("- ", "").replace("\\\\ \\\\", "")
    }

    const getLaTeX = (array) => {
        var latex = "";
        for (let i = 0; i < array.length; i++) {
            console.log(array[i])
            latex += "\\section{" + getText(array[i].header) + "}\n";
            latex += array[i].latex + "\\\\\n";
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
                    <textarea readOnly className="form-control" style={{ height: "300px" }}>{getLaTeX(latexForRender)}</textarea>
                    <br></br>
                </div>
            )
        }
    }

    const deserializeSolution = (solution) => {
        var solutionAux = []
        const aux_01 = solution.replaceAll("'", "\"")
        const aux_02 = aux_01.replaceAll("\"\"", "\"")
        console.log(aux_02)

        const jsonSolve = JSON.parse(aux_02)
        for (let index = 0; index < jsonSolve.length; index++) {
            const step = jsonSolve[index];
            console.log(step)

            const stepHeader = step[0]
            const imgBase64Array = []

            var stepLatex = ""
            var stepLatexForRender = ""

            if (getText(stepHeader) !== " Graphs") {
                for (let j = 0; j < step[1].length; j++) {
                    stepLatexForRender += step[1][j];

                    var stepAux = step[1][j]
                    if (!step[1][j].includes('$')) {
                        stepAux = stepAux.replaceAll("\\", "")
                        stepAux = `\\mathtt{\\text{${stepAux}}}\\\\`
                    }

                    stepLatex += stepAux;
                }
            } else {
                for (let j = 0; j < step[1].length; j++) {
                    imgBase64Array.push(step[1][j])
                }
            }

            const stepObject = { latex: stepLatex, header: stepHeader, images: imgBase64Array }
            const stepForRenderObject = { latex: stepLatexForRender, header: stepHeader }

            solutionAux.push(stepObject);
            latexForRender.push(stepForRenderObject);
        }

        setSolution(solutionAux);
    }

    const renderGraphs = (images) => {
        if (images.length === 0) {
            return (<></>)
        } else {
            return images.map(image => (
                <div>
                    <img width="400" src={"data:image/png;base64," + image} alt="Graph"
                    style={{marginBottom: 15}}></img>
                </div>
            ));
        }
    }

    const renderLatexStep = (latex) => {
        console.log()
        return latex.replaceAll("$", "");
    }

    const renderSolve = () => {
        if (solution.length !== 0) {
            var i = 1;
            return solution.map(step => (
                <div>
                    <br></br>
                    <h4>
                        Step {i}:
                        {" " + getText(step.header)}
                        {(() => { i++ })()}
                    </h4><br></br>
                    <MathJax.default.Provider options={{ tex2jax: { processEscapes: true, 
                    inlineMath:  [["\\(","\\)"]], displayMath: [["\\[","\\]"]] }, "HTML-CSS": {
                        fonts: ["TeX"]
                    } }}>
                        <MathJax.default.Node 
                            inline={true} 
                            formula={renderLatexStep(step.latex)} 
                            onRender={() => console.log("Step " + (i-1) + " rendered")}
                        />
                    </MathJax.default.Provider>
                    { renderGraphs(step.images) }
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
        const options = {
            method: "POST",
            uri: `http://${IP_SERVER}/pdf`,
            body: { latex: getLaTeX(latexForRender) },
            json: true
        };

        var flagWait = true;

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
            console.log("Pdf content: ")
            console.log(body.text)
            flagWait = false
            setPdfContent(body.text);
            setDownloadButtonVisibility(true);
        })
    }

    const renderDownloadButton = () => {
        if (downloadButtonVisibility) {
            const day = new Date();
            const pdfName = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}-${day.getHours()}-${day.getMinutes()}-${day.getSeconds()}.pdf` 

            return (
                <a download={ pdfName } href={ `data:application/pdf;base64,${pdfContent}` } title='Download pdf document'
                    className="btn btn-primary">
                    Download PDF Document
                </a>
            )
        } else {
            return <></>
        }
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
                {renderDownloadButton()}
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

