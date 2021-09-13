import React from "react";
import Popup from "../screens/global_components/Popup";

export class ClassificationAnomaly {
    constructor (message, alertPopup, setAlertPopup) {
        this.message = message;
        this.alertPopup = alertPopup;
        this.setAlertPopup = setAlertPopup;
    }

    display = () => {
        return (
            <Popup trigger={ this.alertPopup } setTrigger={ this.setAlertPopup }>
                <h3 style={{ color:"black" }}> Classification Error </h3>
                <p style={{ color:"black" }}> { this.message } </p>
            </Popup>
        )
    }
};