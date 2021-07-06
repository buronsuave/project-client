import React, { useContext, useState } from "react";
import { Link } from 'react-router-dom';
import { XIcon, PinIcon } from '@primer/octicons-react'
import app from "../../../base"
import "./Ecuation.css"
import { AuthContext } from "../../../auth";
import Popup from "../../global_components/Popup";

const MathJax = require('react-mathjax')

const Ecuation = ({ item }) => {

  const [ alertPopup, setAlertPopup ] = useState(false);
  const [ currentTitle, setCurrentTitle ] = useState(null);
  const [ currentError, setCurrentError ] = useState(null);

  const eq = item.equation;
  const date = item.date
  const { currentUser } = useContext(AuthContext);

  const [pinned, setPinned] = useState(item.pinned)

  const onDelete = async () => {
      setAlertPopup(true)
      setCurrentTitle("Success")
      setCurrentError("Equation eliminated successfully")
      const db = app.firestore()
      await db.collection('users').doc(currentUser.uid).collection("equations").doc(item.id).delete()
      window.location.reload(false); 
  }

  const onUpdate = async () => {
    const db = app.firestore()
    var newPinned = !pinned
    setPinned(newPinned)
    await db.collection('users').doc(currentUser.uid).collection("equations").doc(item.id).set({ 
      date: item.date, 
      equation: item.equation, 
      pinned: newPinned
    })
  }

  const renderColor = () => {
    if(pinned){
      return "#5d5d5a"
    }
    else{
      return "#303030"
    }
  }

  return (
    <Link to={`/preview/${eq}`} class="list-group-item list-group-item-action flex-column align-items-start " style={{background: renderColor()}}>
      <div class="d-flex w-100 justify-content-between">
        <MathJax.default.Provider>
          <MathJax.default.Node inline formula={eq} />
        </MathJax.default.Provider>
        <small>
          <Link to={`/record`}>
            <button class="btn bg-transparent" onClick={onDelete}>
              <XIcon size={24} />
            </button>
          </Link>
          <Link to={`/record`}>
            <button class="btn bg-transparent"  onClick={onUpdate}>
              <PinIcon size={24} />
            </button>
          </Link>
        </small>
      </div>
      <p class="mb-1">{date}</p>
      <Popup trigger={alertPopup} setTrigger={setAlertPopup}>
        <h3 style={{ color:"black" }}> { currentTitle } </h3>
        <p style={{ color:"black" }}> { currentError } </p>
      </Popup>
    </Link>
  )
}

export default Ecuation;