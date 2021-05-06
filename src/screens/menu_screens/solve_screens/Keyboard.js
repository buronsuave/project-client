import React from "react";
import Navbar from "../../menu_components/Navbar";
import MathKeyboard from "../solve_components/MathKeyboard";

const Keyboard = ({ history }) => {
    return (
        <div>
            <Navbar />
            <div className="jumbotron">
                <h1>Solve by Keyboard</h1><br></br>
                <MathKeyboard history={ history }/>
            </div>
        </div>
    );
}

export default Keyboard;