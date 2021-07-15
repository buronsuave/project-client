import React from "react";
import Popup from "../screens/global_components/Popup";

export class WaitingScreen {
    constructor(isWaiting, setIsWating) {
        this.isWaiting = isWaiting;
        this.setIsWating = setIsWating;
    }

    display = () => {
        return (
            <Popup trigger={ this.isWaiting } setTrigger={ this.setIsWating }>
                <h3 style={{ color:"black" }}> Solving Equation </h3>
                <p style={{ color:"black" }}> We're solving your equation </p>
            </Popup>
        );
    }
}