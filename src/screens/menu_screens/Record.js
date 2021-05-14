import React from "react";
import "./Record.css"

import Navbar from "../menu_components/Navbar";
import Ecuation from "../menu_screens/record_components/Ecuation";

const Record = () => {

    const ecuation = "- 5y{\\left(x \\right)} + \\frac{d}{d x} y{\\left(x \\right)} = 0"

    return (
        <div>
            <Navbar />
            <div className="jumbotron">
                <h1>Record</h1><br></br>

                <div class="list-group">
                  <Ecuation ecuation={ ecuation }/>
                  <Ecuation ecuation={ ecuation }/>
                  <Ecuation ecuation={ ecuation }/>
                  <Ecuation ecuation={ ecuation }/>
                  <Ecuation ecuation={ ecuation }/>
                </div>
            </div>
        </div>
    );
}

export default Record;