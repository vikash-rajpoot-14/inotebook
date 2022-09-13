import React from 'react'
import { useState } from 'react'
import noteContext from './Notes/noteContext' 

export default function NoteState(props) {
     const s1={
        "name":"vikash",
        "class":"10b"
    }

 const [state, setstate] = useState(s1)
 const update=()=>{
  setTimeout(() => {
    setstate({"name":"Rajpoot","class":"15c"})
  }, 1000);
 }

  return (
    <NoteState.Provoder value={{state,update}}>
          {props.children}
    </NoteState.Provoder>
  )
}
