import React from "react";
import Popup from "../screens/global_components/Popup";

export class SolutionTimeoutAnomaly {
    constructor (alertPopup, setAlertPopup) {
        this.alertPopup = alertPopup;
        this.setAlertPopup = setAlertPopup;
    }

    display = () => {
        return (
            <Popup trigger={ this.alertPopup } setTrigger={ this.setAlertPopup }>
                <h3 style={{ color:"black" }}> Timeout Error </h3>
                <p style={{ color:"black" }}> There was no answer to the equation in 30 seconds </p>
            </Popup>
        )
    }
};