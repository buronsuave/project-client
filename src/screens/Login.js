import React, { useState, useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import app from "../base";
import { AuthContext } from "../auth";
import Popup from "./global_components/Popup";

import "./Login.css";

const Login = ( {history} ) => {

    const [alertPopup, setAlertPopup] = useState(false);
    const [ currentError, setCurrentError ] = useState(null);

    const handleLogin = useCallback(
        async event => {
            event.preventDefault();
            const { email, password } = event.target.elements;
            try {
                await app.auth().signInWithEmailAndPassword(email.value, password.value);
                history.push("/");
            } catch (error) {
                setAlertPopup(true)
                setCurrentError(error.message)
            }
        }, 
        [history]
    );

    const { currentUser } = useContext(AuthContext);
    if (currentUser) {
        return <Redirect to="/" />;
    }

    return (
        <div className="jumbotron">
            <form onSubmit={handleLogin}>
                <fieldset>
                    <legend>Log In</legend>
                    <div className="form-group">
                        <label>Email address</label>
                        <input name="email" type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input name="password" type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"/>
                    </div>
                    <div className="btn-group-vertical">
                        <button type="submit" className="btn btn-primary">Submit</button><br></br>
                        <button onClick={() => history.push("/signup")} type="button" className="btn btn-secondary">Sign Up</button>
                    </div>
                </fieldset>
            </form>
            <Popup trigger={alertPopup} setTrigger={setAlertPopup}>
                <h3 style={{ color:"black" }}> Error </h3>
                <p style={{ color:"black" }}> { currentError } </p>
            </Popup>
        </div>
    );
};

export default withRouter(Login);

