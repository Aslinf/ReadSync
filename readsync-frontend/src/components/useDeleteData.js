import { useState } from "react";

function useDeleteData() {
  const [error, setError] = useState(null);

  const deleteData = async (id, type) => {
    try {
      const response = await fetch('http://localhost:80/readsync/backend/deleteData.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          id: id, 
          type: type
        })
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return { deleteData, error };
}

export default useDeleteData;
