import React, { useCallback, useContext } from "react";
import { withRouter } from "react-router";
import app from "../base";
import { AuthContext } from "../auth";

const SignUp = ({ history }) => {

    //const { currentUser } = useContext(AuthContext);

    const handleSignUp = useCallback(
        async event => {
            event.preventDefault();
            const { email, password, confirmPassword, userType, isSubscribed } = event.target.elements;

            const addUser = async (userType, isSubscribed) => {
                const db = app.firestore();
                var isTrueSet = (isSubscribed.value === 'true')
                
                await db.collection('users').doc().set({
                    isSubscribed: isTrueSet,
                    type: userType.value
                });
            }

            if(password.value !== confirmPassword.value) {
                alert("Passwords dont match")
            }
            else {
                try {
                    app.auth().createUserWithEmailAndPassword(email.value, password.value);
                    await addUser(userType, isSubscribed)
                    history.push("/");
                } catch (error) {
                    alert(error);
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
                        <input name="isSubscribed" class="form-check-input" type="checkbox" value="true" id="defaultCheck1"></input>
                        <label>I want to receive updates in my email</label>
                    </div>
                    <br></br>
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