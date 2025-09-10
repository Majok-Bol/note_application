import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient.js";

export default function App() {
  //track note being set
  const [note, setNote] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  //store notes
  const [storeNotes, setStoreNotes] = useState([]);
  useEffect(() => {
    async function fetchData(){
let {data,error}=await supabase.from("notes").select("*");
console.log(data);
console.log(error);
    }
    fetchData();
    })
    

  function handleAddNotes() {
    if (note.trim() == ""){
alert("Note is empty");
return;
    } 
    if (editIndex !== null) {
      const updatedNotes = [...storeNotes];
      updatedNotes[editIndex] = note;
      setStoreNotes(updatedNotes);
      setEditIndex(null);
    } else {
      //add new note
      const newNote = [...storeNotes, note];
      setStoreNotes(newNote);
    }
    setNote("");
  }
  function handleDeleteNotes(index) {
    const updatedNotes = storeNotes.filter((_, i) => i !== index);
    setStoreNotes(updatedNotes);
  }
  function handleEditNotes(index) {
    setNote(storeNotes[index]);
    setEditIndex(index);
  }
  return (
    <>
      <h1>Note Application</h1>
      <input
        type="text"
        placeholder="Add notes"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAddNotes()}
      />
      <button onClick={handleAddNotes}>
        {editIndex !== null ? "Update Note" : "Add Note"}
      </button>
      <div>
        <h2>Saved Notes</h2>
        <div>
          <ul>
            {storeNotes.map((item, index) => (
              <li key={index}>
                {item}
                <button
                  className="editBtn"
                  onClick={() => handleEditNotes(index)}
                >
                  Edit
                </button>
                <button
                  className="deleteBtn"
                  onClick={() => handleDeleteNotes(index)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
