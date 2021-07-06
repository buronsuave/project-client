import React from "react";
import "./Draw.css"

import Navbar from "../../menu_components/Navbar";
import Canvas from "./Canvas";

const Solve = ({ history }) => {
    return (
        <div>
            <Navbar />
            <div className="jumbotron">
                <h1>Solve by Drawing</h1>
                <Canvas history={ history }/>
            </div>
        </div>
    );
}

export default Solve;