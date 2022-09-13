import {React,useContext}  from 'react'
import noteContext from '../context/Notes/noteContext'
import { useEffect } from 'react'

export default function About() {
  const a = useContext(noteContext)
   useEffect(() => {
    a.update()
   }, [])
   
  return (
    <div>
      <p>this is about {a.name} and {a.class}</p>
    </div>
  )
}
