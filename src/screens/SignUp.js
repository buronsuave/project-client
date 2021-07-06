import React, { useState, useCallback } from "react";
import { withRouter } from "react-router";
import app from "../base";
import Popup from "./global_components/Popup";

const SignUp = ({ history }) => {

    const [alertPopup, setAlertPopup] = useState(false);
    const [ currentError, setCurrentError ] = useState(null);

    const handleSignUp = useCallback(
        async event => {
            event.preventDefault();
            const { email, password, confirmPassword, userType, isSubscribed } = event.target.elements;

            const addUser = async (userType, isSubscribed, uid) => {
                const db = app.firestore();
                var isTrueSet = isSubscribed.checked;
                
                await db.collection('users').doc(uid).set({
                    email: email.value,
                    isSubscribed: isTrueSet,
                    type: userType.value, 
                });
            }

            function validatePassword(newPassword) {
                var minNumberofChars = 6;
                var maxNumberofChars = 16;
                var regularExpression  = /^[a-zA-Z0-9]{6,16}$/;

                if (newPassword.length < minNumberofChars || newPassword.length > maxNumberofChars){
                    setAlertPopup(true)
                    setCurrentError("Bad lenght")
                    return false;
                }

                if (!regularExpression.test(newPassword)) {
                    setAlertPopup(true)
                    setCurrentError("Bad chars")
                    return false;
                }

                return true;
            }
            
            if (!validatePassword(password.value)) {
                setAlertPopup(true)
                setCurrentError("Invalid password")
                return;
            }

            if (password.value !== confirmPassword.value) {
                setAlertPopup(true)
                setCurrentError("Passwords dont match")
                return;
            }

            else {
                try {
                    const newUser = await app.auth().createUserWithEmailAndPassword(email.value, password.value);
                    await addUser(userType, isSubscribed, newUser.user.uid);
                    history.push("/");
                } catch (error) {
                    setAlertPopup(true)
                    setCurrentError(error.message)
                }
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
                        <input name="email" type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input name="password" type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input name="confirmPassword" type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                    </div>
                    <div class="form-group">
                        <label>User type</label>
                        <select name="userType" class="custom-select d-block w-100" id="inputGroupSelect" required>
                            <option value="student">student</option>
                            <option value="teacher">teacher</option>
                        </select>
                    </div>
                    <div class="form-check">
                        <input name="isSubscribed" class="form-check-input" type="checkbox" id="defaultCheck1"></input>
                        <label>I want to receive updates in my email</label>
                    </div>
                    <br></br>
                    <div className="btn-group-vertical">
                        <button type="submit" className="btn btn-primary">Submit</button><br></br>
                        <button onClick={() => history.push("/login")} type="button" className="btn btn-secondary">Log In</button>
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

export default withRouter(SignUp);