import React, { useEffect, useState } from "react";
import app from "./base";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [ currentUser, setCurrentUser ] = useState(null);
    const [ pending, setPending ] = useState(true);

    useEffect(() => {
        app.auth().onAuthStateChanged((user) => {
            setCurrentUser(user);
            setPending(false);
        });
    }, []);

    if (pending) {
        return (
            <div className="jumbotron">
                <h1>Loading...</h1><br></br>
                <div className="progress">
                    <div className="progress-bar bg-danger" role="progressbar" style={ {width: 1000} } 
                    aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
        )
    }

    return (
        <AuthContext.Provider
            value={ {currentUser} }
        >
            { children }
        </AuthContext.Provider>
    );
};