import React, { useCallback } from "react";
//import app from "../../auth";
import "./Settings.css"

import Navbar from "../menu_components/Navbar";

const Settings = ({ item }) => {

    const handleSettings = useCallback(
        async event => {
            event.preventDefault();
            const {password, newPassword, confirmNewPassword, userType, isSubscribed } = event.target.elements;

            const updateUser = async(userType, isSubscribed) => {
                //const db = app.firebase()
                var isTrueSet = (isSubscribed.value === 'true')

                //await db.collecion('users').doc().set(...item, isSubscribed, userType)

            }
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
                            <label>Actual Password (leave it blank to not change)</label>
                            <input name="password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"></input>
                        </div>
                        <div class="form-group">
                            <label>New Password (leave it blank to not change)</label>
                            <input name="newPassword" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"></input>
                        </div>
                        <div class="form-group">
                            <label>Confirm New Password (leave it blank to not change)</label>
                            <input name="confirmNewPassword" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"></input>
                        </div>
                        <div class="form-group">
                            <label>User type</label>
                            <select name="userType" class="custom-select d-block w-100" id="inputGroupSelect" required>
                                <option value="student">student</option>
                                <option value="teacher">teacher</option>
                            </select>
                        </div>
                        <div class="form-check">
                            <input name="isSubscribed" class="form-check-input" type="checkbox" value="" id="defaultCheck1"></input>
                            <label>I want to receive updates in my email</label>
                        </div>
                        <div className="btn-group-vertical">
                        <button type="submit" className="btn btn-primary">Submit</button><br></br>
                    </div>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}

export default Settings;