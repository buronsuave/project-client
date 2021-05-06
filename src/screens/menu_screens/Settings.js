import React from "react";
import "./Settings.css"

import Navbar from "../menu_components/Navbar";

const Settings = () => {
    return (
        <div>
            <Navbar />
            <div className="jumbotron">
                <h1>Settings</h1>
            </div>
        </div>
    );
}

export default Settings;