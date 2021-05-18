import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { XIcon, PinIcon } from '@primer/octicons-react'
import app from "../../../base"
import "./Ecuation.css"

const MathJax = require('react-mathjax')


const Ecuation = ({ item }) => {
  const eq = item.equation;
  const date = item.date

  const [pinned, setPinned] = useState(item.pinned)

  const onDelete = async () => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      const db = app.firestore()
      await db.collection('equations').doc(item.id).delete()
    }
  }

  const onUpdate = async () => {
    const db = app.firestore()
    setPinned(!pinned)
    await db.collection('equations').doc(item.id).set({ ...item, pinned })
  }

  return (
    <Link to={`/preview/${eq}`} class="list-group-item list-group-item-action flex-column align-items-start">
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
            <button class="btn bg-transparent"  Click={onUpdate}>
              <PinIcon size={24} />
            </button>
          </Link>
        </small>
      </div>
      <p class="mb-1">{date}</p>
    </Link>
  )
}

export default Ecuation;