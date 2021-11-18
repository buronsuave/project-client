import React from "react";
import "./About.css"

import Navbar from "../menu_components/Navbar";
const MathJax = require('react-mathjax');

const About = () => {
    return (
        <div>
            <Navbar />
            <div className="jumbotron">
                <h1>About</h1><br/>
                <h3>System syntax</h3><br/>
                <p style={{fontSize: 20}}>
                The PWA for ODE application has a strict syntax for writing differential equations to have better results 
                in classifying and solving the requested differential equations. The type of input where we can see the 
                form of the allowed values is by keyboard, so the user is recommended to use this option to ensure that the 
                equation is processed properly. 
                The differential equation must be presented with the following notation:
                <ul>
                    <li>
                        The only valid variables are 'y' and 'x', and represent the dependent and independent variable respectively                    
                    </li>
                    <li>
                        When writing to the function 'y', the dependency it has on the variable 'x' should not be added (that is, the 
                        expression y(x) is inferred in the system by expecting this relationship between the variables).
                    </li>
                    <li>
                        The derivative must be denoted as D(y,x) and represents the "derivative of the dependent variable with respect 
                        to the independent one". This is the only way the system can interpret the derivative.
                    </li>
                    <li>
                        All operations performed on the equation must be explicitly stated, including multiplication (that is, the expression 
                        'xy' will not be valid, while the expression x*y will be)
                    </li>
                    <li>
                        To establish the hierarchy of operations, only the parenthesis is allowed as a grouper. It is important to emphasize that 
                        the explicit multiplication rule from the previous step also applies to this case.
                    </li>
                </ul>
                The expressions that are recognized by the system as mathematical objects are listed below
                (expression could be any algebraic expression; N/A shortcuts are the same symbols):
                <br/>
                <br/>
                    <tr className="row">
                        <th className="col-sm-2">Text</th>
                        <th className="col-sm">Description</th>
                        <th className="col-sm">Shortcut</th>
                    </tr>
                    <tr className="row">
                        <td className="col-sm-2">sin( )</td>
                        <td className="col-sm">Calculates the sin() value of the expression in parentheses</td>
                        <td className="col-sm">s</td>
                    </tr>
                    <tr className="row">
                        <td className="col-sm-2">cos( )</td>
                        <td className="col-sm">Calculates the cos() value of the expression in parentheses</td>
                        <td className="col-sm">c</td>
                    </tr>
                    <tr className="row">
                        <td className="col-sm-2">tan( )</td>
                        <td className="col-sm">Calculates the tan() value of the expression in parentheses</td>
                        <td className="col-sm">t</td>
                    </tr>
                    <tr className="row">
                        <td className="col-sm-2">sec( )</td>
                        <td className="col-sm">Calculates the sec() value of the expression in parentheses</td>
                        <td className="col-sm">shift+s</td>
                    </tr>
                    <tr className="row">
                        <td className="col-sm-2">csc( )</td>
                        <td className="col-sm">Calculates the csc() value of the expression in parentheses</td>
                        <td className="col-sm">shift+c</td>
                    </tr>
                    <tr className="row">
                        <td className="col-sm-2">cot( )</td>
                        <td className="col-sm">Calculates the cot() value of the expression in parentheses</td>
                        <td className="col-sm">shift+t</td>
                    </tr>
                    <tr className="row">
                        <td className="col-sm-2">0, 1, ..., 9</td>
                        <td className="col-sm">Avaliable digits</td>
                        <td className="col-sm">N/A</td>
                    </tr>
                    <tr className="row">
                        <td className="col-sm-2">.</td>
                        <td className="col-sm">Decimal point (only between two digits)</td>
                        <td className="col-sm">N/A</td>
                    </tr>
                    <tr className="row">
                        <td className="col-sm-2">,</td>
                        <td className="col-sm">Separable comma (only in derivative expression)</td>
                        <td className="col-sm">N/A</td>
                    </tr>
                    <tr className="row">
                        <td className="col-sm-2">(  )</td>
                        <td className="col-sm">Parentheses (four grouping and derivative expression)</td>
                        <td className="col-sm">N/A</td>
                    </tr>
                    <tr className="row">
                        <td className="col-sm-2">+, -, *, /, ^</td>
                        <td className="col-sm">Add, Sub, Mul, Div and Pow expressions</td>
                        <td className="col-sm">N/A</td>
                    </tr>
                    <tr className="row">
                        <td className="col-sm-2">=</td>
                        <td className="col-sm">Equal sign (just one per equation and must be between two expressions)</td>
                        <td className="col-sm">N/A</td>
                    </tr>
                    <tr className="row">
                        <td className="col-sm-2">ln( )</td>
                        <td className="col-sm">Natural log of the expression in parentheses</td>
                        <td className="col-sm">l</td>
                    </tr>
                    <tr className="row">
                        <td className="col-sm-2">sqrt( )</td>
                        <td className="col-sm">Square root of the expression in parentheses</td>
                        <td className="col-sm">r</td>
                    </tr>
                    <tr className="row">
                        <td className="col-sm-2">pi</td>
                        <td className="col-sm">Pi number</td>
                        <td className="col-sm">p</td>
                    </tr>
                    <tr className="row">
                        <td className="col-sm-2">E</td>
                        <td className="col-sm">Euler number</td>
                        <td className="col-sm">N/A</td>
                    </tr>
                    <tr className="row">
                        <td className="col-sm-2">D( )</td>
                        <td className="col">Derivative operator. It should be written in the form D(y,x)</td>
                        <td className="col-sm">N/A</td>
                    </tr>
                    <tr className="row">
                        <td className="col-sm-2">x</td>
                        <td className="col-sm">Independent variable</td>
                        <td className="col-sm">N/A</td>
                    </tr>
                    <tr className="row">
                        <td className="col-sm-2">y</td>
                        <td className="col-sm">Dependent variable (function)</td>
                        <td className="col-sm">N/A</td>
                    </tr>
                </p><br/>
                <h3>Input examples</h3><br/>
                <p style={{fontSize: 20}}>

                    <tr className="row">
                        <td className="col table-secondary">
                        <br></br>
                        <strong>Input & equation</strong>
                        <br></br>
                        </td>

                        <td className="col">
                        D(y,x)=x<br/><br/>
                            <MathJax.default.Provider>
                                <MathJax.default.Node inline formula="\frac{dy}{dx} = x" />
                            </MathJax.default.Provider>
                        <br></br>
                        </td>

                        <td className="col">
                        y*D(y,x)=pi<br/><br/>
                            <MathJax.default.Provider>
                                <MathJax.default.Node inline formula="y\frac{dy}{dx} = \pi" />
                            </MathJax.default.Provider>
                        <br></br>
                        </td>

                        <td className="col">
                        (E^(3*x))*(x^3)=D(y,x)<br/><br/>
                            <MathJax.default.Provider>
                                <MathJax.default.Node inline formula="e^{3x}x^3=\frac{dy}{dx}" />
                            </MathJax.default.Provider>
                        <br></br>
                        </td>

                        <td className="col">
                        (sin(x))*(cos(2x)) = D(y,x)<br/><br/>
                            <MathJax.default.Provider>
                                <MathJax.default.Node inline formula="\sin{x}\cos{2x} = \frac{dy}{dx}" />
                            </MathJax.default.Provider>
                        <br></br>
                        </td>
                    </tr>
                    <br/>

                    <tr className="row">
                        <td className="col table-secondary">
                        <br></br>
                        <strong>Input & equation</strong>
                        <br></br>
                        </td>

                        <td className="col">
                        ln(3*x)=x*D(y,x)<br/><br/>
                            <MathJax.default.Provider>
                                <MathJax.default.Node inline formula="\log{3x}=x\frac{dy}{dx}" />
                            </MathJax.default.Provider>
                        <br></br>
                        </td>

                        <td className="col">
                        sin(x^2)=D(y,x)<br/><br/>
                            <MathJax.default.Provider>
                                <MathJax.default.Node inline formula="\sin{x^2} = \frac{dy}{dx}" />
                            </MathJax.default.Provider>
                        <br></br>
                        </td>

                        <td className="col">
                        (D(y,x))/x=sin(x)<br/><br/>
                            <MathJax.default.Provider>
                                <MathJax.default.Node inline formula="\frac{1}{x}\frac{dy}{dx} = \sin(x)" />
                            </MathJax.default.Provider>
                        <br></br>
                        </td>

                        <td className="col">
                        ln(sqrt(x)) = D(y,x)<br/><br/>
                            <MathJax.default.Provider>
                                <MathJax.default.Node inline formula="\log{\sqrt{x}} = \frac{dy}{dx}" />
                            </MathJax.default.Provider>
                        <br></br>
                        </td>
                    </tr>
                </p>
            </div>
        </div>
    );
}

export default About;