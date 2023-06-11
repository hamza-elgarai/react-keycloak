import React from 'react'
import "./Box.css"

export const Box = ({value, id, onClick}) => {
  return (
    <button key={id} 
    className={`box ${value === "X" ? "x" : "o"}`} 
    onClick = {onClick}>
    {value}
    </button>
  )
}
export default Box