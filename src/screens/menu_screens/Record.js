import React, { useState, useEffect, useContext } from "react";
import app from "../../base";
import { AuthContext } from "../../auth"
import "./Record.css"

import Navbar from "../menu_components/Navbar";
import Ecuation from "../menu_screens/record_components/Ecuation";

const Record = () => {
    const [equations, setEquations] = useState([]);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            const db = app.firestore()
            db.collection("equations").onSnapshot((querySnapshot) => {
                const docs = []
                querySnapshot.forEach((doc) => {
                    if (doc.data().idUser === currentUser.uid) {
                        docs.push({ ...doc.data(), id: doc.id });
                    }
                })
                setEquations(docs)
            })
        }
        fetchData()
    }, [currentUser.uid]);

    const renderRecord = () => {
        return equations.map(item => (
            <Ecuation item={ item } />
        ))
    }

    return (
        <div>
            <Navbar />
            <div className="jumbotron">
                <h1>Record</h1><br></br>
                <div class="list-group">
                    { renderRecord() }
                </div>
            </div>
        </div>
    );
}

export default Record;