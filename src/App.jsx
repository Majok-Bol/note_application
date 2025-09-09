import { useEffect, useState } from "react";

export default function App() {
  const[note,setNote]=useState("");
  //store notes
  const [storeNotes, setStoreNotes] = useState(()=> {
    try{
    //local data on page load
  return JSON.parse(localStorage.getItem("notes")) || [];

    }catch(error){
      console.log("Error fetching data: ",error);
      return [];
    }


  });
  useEffect(() => {
    //add notes to local storage
    localStorage.setItem("notes", JSON.stringify(storeNotes));
  }, [storeNotes]);
  function handleAddNotes() {
    //get note input
    //add them on button click
    setStoreNotes([...storeNotes, note]);
    //reset input
    setNote("");
  }

  return (
    <>
      <h1>Note Application</h1>
      <input
        type="text"
        placeholder="Add notes"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onKeyDown={(e)=>e.key==='Enter'&&handleAddNotes()}
      />
      <button onClick={handleAddNotes}>Add</button>
      <div>
        <h2>Saved Notes</h2>
        <ul>
          {storeNotes.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
