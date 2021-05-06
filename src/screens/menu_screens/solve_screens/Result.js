import React from "react";
import Navbar from "../../menu_components/Navbar";
import "./Result.css";

const Result = () => {
    const res = this.props.location.state.res;

    return (
        <div>
            <Navbar />
            <div className="jumbotron">
                <h1>Here's your solution</h1>
                <p>{res}</p>
            </div>
        </div>
    )
}

export default Result;