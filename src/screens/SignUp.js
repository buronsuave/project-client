import React, { useCallback } from "react";
import { withRouter } from "react-router";
import app from "../base";

const SignUp = ({ history }) => {

    const handleSignUp = useCallback(
        async event => {
            event.preventDefault();
            const { email, password } = event.target.elements;
            try {   
                app.auth().createUserWithEmailAndPassword(email.value, password.value);
                history.push("/");
            } catch (error) {
                alert(error);
            }
        }, [history]
    );

    return (
        <div className="jumbotron">
            <form onSubmit={handleSignUp}>
                <fieldset>
                    <legend>Sign Up</legend>
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
                        <button onClick={() => history.push("/login")} type="button" className="btn btn-secondary">Log In</button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
};

export default withRouter(SignUp);