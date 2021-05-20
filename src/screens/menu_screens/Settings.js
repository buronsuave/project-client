import React from "react";
import "./Settings.css"

import Navbar from "../menu_components/Navbar";

const Settings = () => {
    return (
        <div>
            <Navbar />
            <div className="jumbotron">
                <h1>Settings</h1>
                <form>
                    <fieldset>
                        <div class="form-group">
                            <label>Email address</label>
                            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"></input>
                            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"></input>
                        </div>
                        <div class="form-group">
                            <label>Example select</label>
                            <select class="custom-select d-block w-100" id="country" required="">
                                <option value="">Choose...</option>
                                <option>United States</option>
                            </select>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="defaultCheck1"></input>
                            <label>Default radio</label>
                        </div>
                        <br></br>
                        <button type="button" class="btn btn-primary">Primary</button>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}

export default Settings;