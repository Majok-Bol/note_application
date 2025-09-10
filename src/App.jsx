import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient.js";

export default function App() {
  //track note being set
  const [note, setNote] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  //store notes
  const [storeNotes, setStoreNotes] = useState([]);
useEffect(() => {
  async function fetchData() {
    let { data, error } = await supabase.from("notes").select("*").order("id", { ascending: true });
    if (error) {
      console.error("Error fetching notes:", error.message);
    } else {
      setStoreNotes(data); //  put notes into React state
    }
  }
  fetchData();
}, []); // empty dependency so it runs only once when app loads

    

async function handleAddNotes() {
  if (note.trim() === "") {
    alert("Note is empty");
    return;
  }

  if (editIndex !== null) {
    //  Update note in Supabase
    const noteToUpdate = storeNotes[editIndex];
    let { error } = await supabase
      .from("notes")
      .update({ content: note })
      .eq("id", noteToUpdate.id);

    if (error) {
      console.error("Error updating note:", error.message);
    } else {
      const updatedNotes = [...storeNotes];
      updatedNotes[editIndex].content = note;
      setStoreNotes(updatedNotes);
      setEditIndex(null);
    }
  } else {
    // Insert new note
    let { data, error } = await supabase
      .from("notes")
      .insert([{ content: note }])
      .select();

    if (error) {
      console.error("Error adding note:", error.message);
    } else {
      setStoreNotes([...storeNotes, data[0]]);
    }
  }
  setNote("");
}

async function handleDeleteNotes(index) {
  const noteToDelete = storeNotes[index];
  let { error } = await supabase.from("notes").delete().eq("id", noteToDelete.id);

  if (error) {
    console.error("Error deleting note:", error.message);
  } else {
    const updatedNotes = storeNotes.filter((_, i) => i !== index);
    setStoreNotes(updatedNotes);
  }
}
function handleEditNotes(index) {
  setNote(storeNotes[index].content);
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
    <li key={item.id}>
      {item.content}
      <button onClick={() => handleEditNotes(index)}>Edit</button>
      <button onClick={() => handleDeleteNotes(index)}>Delete</button>
    </li>
  ))}
</ul>

        </div>
      </div>
    </>
  );
}
