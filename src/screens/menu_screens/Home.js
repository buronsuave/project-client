import React from "react";
import "./Home.css"

import Navbar from "../menu_components/Navbar";

const Home = () => {
    return (
        <div>
            <Navbar />
            <div className="jumbotron">
                <h1 className="display-3">Welcome to PWA for ODE!</h1>
                <p className="lead">Solve your differential equations with us and get amazing presentations of your solutions</p>
                <hr className="my-4"/>
                <p>Get the steps to solve higher order linear, homogeneous, exact, and separable ordinary differential equations.</p>
                <p className="lead">
                    <a className="btn btn-primary btn-lg" href="/keyboard" role="button">Let's solve it!</a>
                </p>
            </div>
        </div>
    );
}

export default Home;