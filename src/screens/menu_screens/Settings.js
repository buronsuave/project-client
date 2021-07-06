import firebase from "firebase/app";
import React, { useEffect, useCallback, useContext, useState } from "react";
import app from "../../base";
import "./Settings.css";
import { AuthContext } from "../../auth";
import Navbar from "../menu_components/Navbar";
import Popup from "../global_components/Popup";

const Settings = ({ item }) => {

    const [alertPopup, setAlertPopup] = useState(false);
    const [ currentError, setCurrentError ] = useState(null);
    const [ currentTitle, setCurrentTitle ] = useState(null);

    const { currentUser } = useContext(AuthContext);
    const [currentUserType, setCurrentUserType] = useState(null);
    const [currentSubscribed, setCurrentSubscribed] = useState(null);

    const uid = currentUser.uid;

    useEffect(() => {
        const fetchData = async () => {
            const db = app.firestore()
            db.collection("users").onSnapshot((querySnapshot) => {
                const docs = []
                querySnapshot.forEach((doc) => {
                    if (doc.id === currentUser.uid) {
                        docs.push({ ...doc.data(), id: doc.id });
                    }
                });

                try {
                    setCurrentUserType(docs[0].type);
                    setCurrentSubscribed(docs[0].isSubscribed);
                } catch (someError) {
                    setAlertPopup(true)
                    setCurrentTitle("Error")
                    setCurrentError(someError.message)
                }
            })
        }
        fetchData()
    }, [currentUser.uid]);

    const renderCurrentValues = () => {
        if (currentUserType === "teacher" && currentSubscribed) {
            return (
                <>
                <div class="form-group">
                    <label>User type</label>
                        <select name="userType" class="custom-select d-block w-100" id="inputGroupSelect" required>
                            <option value="student">student</option>
                            <option value="teacher" selected>teacher</option>
                        </select>
                </div>
                <div class="form-check">
                    <input name="isSubscribed" class="form-check-input" type="checkbox" id="defaultCheck1" defaultChecked></input>
                    <label>I want to receive updates in my email</label>
                </div>   
                </>
            );
        } else if (currentUserType === "teacher" && !currentSubscribed) {
            return (
                <>
                <div class="form-group">
                    <label>User type</label>
                        <select name="userType" class="custom-select d-block w-100" id="inputGroupSelect" required>
                            <option value="student">student</option>
                            <option value="teacher" selected>teacher</option>
                        </select>
                </div>
                <div class="form-check">
                    <input name="isSubscribed" class="form-check-input" type="checkbox" id="defaultCheck1"></input>
                    <label>I want to receive updates in my email</label>
                </div>
                </>
            );
        } else if (currentUserType === "student" && currentSubscribed) {
            return (
                <>
                <div class="form-group">
                    <label>User type</label>
                        <select name="userType" class="custom-select d-block w-100" id="inputGroupSelect" required>
                            <option value="student" selected>student</option>
                            <option value="teacher">teacher</option>
                        </select>
                </div>
                <div class="form-check">
                    <input name="isSubscribed" class="form-check-input" type="checkbox" id="defaultCheck1" defaultChecked></input>
                    <label>I want to receive updates in my email</label>
                </div>
                </>
            );
        } else {
            return (
                <>
                <div class="form-group">
                    <label>User type</label>
                        <select name="userType" class="custom-select d-block w-100" id="inputGroupSelect" required>
                            <option value="student" selected>student</option>
                            <option value="teacher">teacher</option>
                        </select>
                </div>
                <div class="form-check">
                    <input name="isSubscribed" class="form-check-input" type="checkbox" id="defaultCheck1"></input>
                    <label>I want to receive updates in my email</label>
                </div>
                </>
            );
        }
    }

    const handleSettings = useCallback(
        async event => {
            event.preventDefault();
            const { password, newPassword, confirmNewPassword, userType, isSubscribed } = event.target.elements;

            var credentials = firebase.auth.EmailAuthProvider.credential(
                currentUser.email,
                password.value
            );

            try {
                await currentUser.reauthenticateWithCredential(credentials);
            } catch (passError) {
                setAlertPopup(true)
                setCurrentTitle("Error")
                setCurrentError("Password is incorrect")
                return;
            }

            if (password.value === newPassword.value) {
                setAlertPopup(true)
                setCurrentTitle("Error")
                setCurrentError("New password can not be the current password")
                return;
            }

            function validatePassword(newPassword) {
                var minNumberofChars = 6;
                var maxNumberofChars = 16;
                var regularExpression = /^[a-zA-Z0-9]{6,16}$/;

                if (newPassword.length < minNumberofChars || newPassword.length > maxNumberofChars) {
                    setAlertPopup(true)
                    setCurrentTitle("Error")
                    setCurrentError("Bad length")
                    return false;
                }

                if (!regularExpression.test(newPassword)) {
                    setAlertPopup(true)
                    setCurrentTitle("Error")
                    setCurrentError("Bad chars")
                    return false;
                }

                return true;
            }

            if (newPassword.value !== "" && !validatePassword(newPassword.value)) {
                setAlertPopup(true)
                setCurrentTitle("Error")
                setCurrentError("Invalid new password")
                return;
            }

            if (newPassword.value !== "" && newPassword.value !== confirmNewPassword.value) {
                setAlertPopup(true)
                setCurrentTitle("Error")
                setCurrentError("New Passwords dont match")
                return;
            }

            const updateUser = async (userTypeStr, isSubscribed) => {
                const db = app.firestore();
                var isTrueSet = isSubscribed.checked;

                await db.collection('users').doc(uid).set({
                    email: currentUser.email,
                    isSubscribed: isTrueSet,
                    type: userTypeStr,
                });

                if (newPassword.value !== "") {
                    await currentUser.updatePassword(newPassword.value);
                }
            }

            await updateUser(userType.value, isSubscribed);
            password.value = "";
            newPassword.value = "";
            confirmNewPassword.value = "";
            setAlertPopup(true)
            setCurrentTitle("Success")
            setCurrentError("The changes were successful")

        }, [item]
    );

    return (
        <div>
            <Navbar />
            <div className="jumbotron">
                <h1>Settings</h1>
                <form onSubmit={handleSettings}>
                    <fieldset>
                        <div class="form-group">
                            <label>Actual Password</label>
                            <input name="password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"></input>
                        </div>
                        <div class="form-group">
                            <label>New Password (leave empty to not change)</label>
                            <input name="newPassword" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"></input>
                        </div>
                        <div class="form-group">
                            <label>Confirm New Password (leave empty to not change)</label>
                            <input name="confirmNewPassword" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"></input>
                        </div>

                        { renderCurrentValues() }

                        <div className="btn-group-vertical">
                            <button type="submit" className="btn btn-primary">Submit</button><br></br>
                        </div>
                    </fieldset>
                </form>
            </div>
            <Popup trigger={alertPopup} setTrigger={setAlertPopup}>
                <h3 style={{ color:"black" }}> { currentTitle } </h3>
                <p style={{ color:"black" }}> { currentError } </p>
            </Popup> 
        </div>
    );
}

export default Settings;