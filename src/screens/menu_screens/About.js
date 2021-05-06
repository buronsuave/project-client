import React from "react";
import "./About.css"

import Navbar from "../menu_components/Navbar";

const About = () => {
    return (
        <div>
            <Navbar />
            <div className="jumbotron">
                <h1>About</h1>
            </div>
        </div>
    );
}

export default About;