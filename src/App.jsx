import axios from 'axios'
import React, { startTransition, useCallback, useEffect, useState } from 'react'

const App = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URI;

  const [title, settitle] = useState('')
  const [status, setstatus] = useState(false)
const [taskData, settaskData] = useState([])
const getAllTask = useCallback(async () => {
    try {
      const resp = await axios.get(`${baseUrl}/api/getalltodo`);
      if (resp?.data) {
        startTransition(() => {
        settaskData(resp.data?.reverse());
      });
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, []); // Empty dependency array because baseUrl is a constant

  // 3. Simple useEffect that calls the stable function
  useEffect(() => {
    getAllTask();
  }, [getAllTask]); 

  const handleAddTask = async () => {
    try {
      if(!title || title.trim() === ''){
        return
      }
      const resp = await axios.post(`${baseUrl}/api/create`, { title, status:false });
      if (resp?.data) {
        console.log("Task Added");
        settitle(''); // Clear input after success
        getAllTask(); // Re-use the same function to refresh the list
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  
// console.log(taskData)
const handleDelete = async (id) => {
  try {
   const resy = window.confirm("Areyou really want to delete?")
   if(resy){
     await axios.delete(`${baseUrl}/api/delete/${id}`)
     getAllTask()
   }
  } catch (error) {
     console.error("Error adding task:", error);
  }
}
const handleStatus = async (id, currentStatus) => {
  try {
    // 1. Send the toggled status (!currentStatus) to the backend
    await axios.patch(`${baseUrl}/api/update/${id}`, {
      status: !currentStatus 
    });

    // 2. Refresh the list only AFTER the update is successful
    getAllTask();
  } catch (error) {
    console.error("Error updating status:", error);
  }
};
  return (
    <div>
      <h1 className='text-center text-2xl font-bold'>Spring Boot Todo App</h1>
      <div className='flex items-center justify-center'>
        <input value={title} onChange={(e)=>settitle(e.target.value)} className='border-none outline-none text-lg ' type="text" placeholder='Enter Task...' />
        {/* <input type="checkbox" name="checked" onChange={()=>setstatus(status ?false: true)} /> */}
        <button onClick={handleAddTask} className='bg-orange-500 cursor-pointer px-4'>Add Task</button>
      </div>
      <div>
        {
          taskData?.map((e,index)=>(
            <div key={index} >
              <div className='border p-2 rounded-md m-2 flex items-center justify-between'>
                {index+1}.
                <input 
  type="checkbox" 
  checked={e.status} // Use 'checked' for boolean state
  onChange={() => handleStatus(e._id, e.status)} // Pass the current status to be toggled
/>
                <div>
                  <h1 className='font-bold text-lg'>Title: {e?.title}</h1>
                <h1 className={`${e?.status ? 'text-green-500 font-bold' : 'text-red-600 font-bold'}`}>Status: {e?.status? 'Completed' : 'Pending'}</h1>
                </div>
                 <div>
                <button onClick={()=>handleDelete(e?._id)}>Delete</button>
                {/* <button>Edit</button> */}
              </div>
              </div>
             
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default App