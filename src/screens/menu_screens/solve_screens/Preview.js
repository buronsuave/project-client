import React, { useState, useContext } from 'react'
import { useParams } from 'react-router'

import Navbar from "../../menu_components/Navbar";
import app from "../../../base";
import { AuthContext } from "../../../auth";

const request = require("request-promise");

const MathJax = require('react-mathjax')

const Preview = () => {
    const { currentUser } = useContext(AuthContext);
    const { equation } = useParams();
    const [solution, setSolution] = useState([]);
    const [showLatex, setShowLatex] = useState(false);

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
        const res = await request(options);
        if (res.status !== 'ok') {
            alert(res.status);
        } else {
            var solutionAux = []
            const aux = res.solution.replaceAll("'", "\"")
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
            </div>
        </div>
    )
}

export default Preview;

