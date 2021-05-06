import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import { AuthProvider } from "./auth";

import Login from "./screens/Login";
import SignUp from "./screens/SignUp";

import Home from "./screens/menu_screens/Home";
import Record from "./screens/menu_screens/Record";
import Settings from "./screens/menu_screens/Settings";
import About from "./screens/menu_screens/About";
import Draw from "./screens/menu_screens/solve_screens/Draw";
import Keyboard from "./screens/menu_screens/solve_screens/Keyboard";
import Picture from "./screens/menu_screens/solve_screens/Picture";
import Result from "./screens/menu_screens/solve_screens/Result";
import Preview from "./screens/menu_screens/solve_screens/Preview";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div>
                    {/**
                     * Private Screens
                     */}
                    <PrivateRoute exact path="/" component={Home}/>
                    <PrivateRoute exact path="/record" component={Record}/>
                    <PrivateRoute exact path="/settings" component={Settings}/>
                    <PrivateRoute exact path="/about" component={About}/>
                    <PrivateRoute exact path="/preview/:equation/:string" component={Preview}/>

                     {/**
                      * Solve Screens
                      */}
                    <PrivateRoute exact path="/draw" component={Draw}/>
                    <PrivateRoute exact path="/keyboard" component={Keyboard}/>
                    <PrivateRoute exact path="/picture" component={Picture}/>

                    {/**
                     * Solution Screens
                     */}
                    <PrivateRoute exact path="/result" component={Result}/>

                    {/**
                     * Public Screens
                     */}
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/signup" component={SignUp}/>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;