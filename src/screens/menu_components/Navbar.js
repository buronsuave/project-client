import React from "react";
import app from "../../base";
import "./Navbar.css";

import { useState } from "react";

const Navbar = () => {
    const [ toggle, setToggle ] = useState(true);

    const toggleState = () => {
        setToggle(!toggle);
        const doc = document.getElementById("navbarElements");
        if (toggle) {
            doc.classList.remove("collapse");
        } else {
            doc.classList.add("collapse");
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <button className="navbar-toggler collapsed" type="button" onClick={toggleState}>
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarElements">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="/">Home
                            <span className="sr-only">(current)</span>    
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/draw">Draw</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/keyboard">Keyboard</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/picture">Picture</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/record">Record</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/settings">Settings</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/about">About</a>
                    </li>
                </ul>
                <button onClick={() => app.auth().signOut()} className="btn btn-danger my-2 my-lg-0">
                    Sign Out
                </button>
            </div>
        </nav>
    );  
}

export default Navbar;