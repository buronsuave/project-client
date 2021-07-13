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
            db.collection("users").doc(currentUser.uid).collection("equations").onSnapshot((querySnapshot) => {
                const docs = []
                querySnapshot.forEach((doc) => {
                    docs.push({ ...doc.data(), id: doc.id });
                })
                setEquations(docs)
            })
        }
        fetchData()
    }, [currentUser.uid]);

    const renderRecord = () => {
        const db = app.firestore()

        if (equations.length === 0) {
            return (
                <>
                    <p className="lead">You haven't solved any differential equations yet. Try some to generate a history</p>    
                </>
            );
        } else {
            var equationsPinnedSorted = []
            var equationsNoPinnedSorted = []
            var equationsSorted = []

            for (var i = 0; i < equations.length; i++) {
                if (equations[i].pinned) {
                    equationsPinnedSorted.push(equations[i]);
                } else {
                    equationsNoPinnedSorted.push(equations[i]);
                }
            }

            equationsPinnedSorted = sortByDate(equationsPinnedSorted);
            equationsNoPinnedSorted = sortByDate(equationsNoPinnedSorted);

            for (i = 0; i < equationsPinnedSorted.length; i++) {
                equationsSorted.push(equationsPinnedSorted[i]);
            }

            for (i = 0; i < equationsNoPinnedSorted.length; i++) {
                equationsSorted.push(equationsNoPinnedSorted[i]);
            }

            const today = new Date();
            for (i = equationsSorted.length - 1; i >= 0; i--) {
                // remove out date from database
                var checkDate = Date.parse(equationsSorted[i].date)

                // 60_000 = 1 minute
                // 3_600_000 = 1 hour
                // 86_400_000 = 1 day
                // 2_592_000_000 = 30 days
                if (((today - checkDate) > 2_592_000_000) && !equationsSorted[i].pinned) {
                    db.collection('users').doc(currentUser.uid).collection('equations').doc(equationsSorted[i].id).delete()
                    equationsSorted.splice(i, 1)
                }
            }

            const MAX_ELEMENTS = 30;

            try {
                if (equationsSorted.length > MAX_ELEMENTS) {
                    // remove extras from database
                    for (var j = MAX_ELEMENTS; j < equationsSorted.length; j++) {
                        db.collection('users').doc(currentUser.uid).collection("equations").doc(equationsSorted[j].id).delete()
                    }
    
                    while (equationsSorted.length > MAX_ELEMENTS) {
                        equationsSorted.pop();
                    }
                }
            } catch (exception) {
                
            }

            return equationsSorted.map(item => (
                <Ecuation item={ item } />
            ));
        }
    }

    const sortByDate = (array) => {
        var di, dj, aux; 
        for (var i = 0; i < array.length; i++) {
            for (var j = i+1; j < array.length; j++) {
                di = Date.parse(array[i].date);
                dj = Date.parse(array[j].date);
                if (di < dj) {
                    aux = array[i];
                    array[i] = array[j];
                    array[j] = aux;
                }
            }
        }
        return array;
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