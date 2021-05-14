import React from "react";
import { Link } from 'react-router-dom';
import {XIcon, PinIcon} from '@primer/octicons-react'
import "./Ecuation.css"

const MathJax = require('react-mathjax')

const Ecuation = ({ ecuation }) => {
    return (
        <Link to={`/preview/${ecuation}`} class="list-group-item list-group-item-action flex-column align-items-start">
          <div class="d-flex w-100 justify-content-between">
            <MathJax.default.Provider>
              <MathJax.default.Node inline formula = { ecuation }/>
            </MathJax.default.Provider>
            <small>  
              <button class="btn bg-transparent">
                <XIcon size={24} />
              </button>  
              <button class="btn bg-transparent">
                <PinIcon size={24} />    
              </button> 
            </small>
          </div>
          <p class="mb-1">Sunday 4, April 18:25</p>   
        </Link> 
    )
}

export default Ecuation;