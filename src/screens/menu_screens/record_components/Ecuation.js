import React, { useState, useCallback } from "react";
import { Link } from 'react-router-dom';
import { XIcon, PinIcon } from '@primer/octicons-react'
import app from "../../../base"
import "./Ecuation.css"

const MathJax = require('react-mathjax')

const Ecuation = ({ item }) => {
  const eq = item.equation;
  const date = item.date

  // Me voy a dormir de una vez, mañana le sigo tempra
  // Le das commit cuando acabes, y lo subes

  const useToggle = (initialState) => {
    const [isToggled, setIsToggled]  = useState(initialState)

    const toggle = React.useCallback(
      () => setIsToggled(state => !state),
      [setIsToggled],
    )

    return [isToggled, toggle]
  }

  const onDelete = async () => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      const db = app.firestore()
      await db.collection('equations').doc(item.id).delete()
    }
  }

  const onUpdate = () => {
    const [isToggled, toggle] = useToggle(item.pinned)
    
    const db = app.firestore()
    db.collection('equations').doc(item.id).set({ ...item, isToggled })
  }

  return (
    <Link to={`/preview/${eq}`} class="list-group-item list-group-item-action flex-column align-items-start">
      <div class="d-flex w-100 justify-content-between">
        <MathJax.default.Provider>
          <MathJax.default.Node inline formula={eq} />
        </MathJax.default.Provider>
        <small>
          <button class="btn bg-transparent" onClick={onDelete}>
            <XIcon size={24} />
          </button>
          <button 
            class="btn bg-transparent" onClick={toggle}>
            <PinIcon size={24} />
          </button>
        </small>
      </div>
      <p class="mb-1">{date}</p>
    </Link>
  )
}

export default Ecuation;