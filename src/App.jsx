import { useState, useEffect } from 'react';
import './App.css';
import { AgGridReact } from 'ag-grid-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Addbook from './components/AddBook';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

function App() {
  const [books, setbooks] = useState([]);

  const columnDefs = [
    { field: 'title', sortable: true, filter: true},
    { field: 'author', sortable: true, filter: true},
    { field: 'year', sortable: true, filter: true},
    { field: 'isbn', sortable: true, filter: true},
    { field: 'price', sortable: true, filter: true},
    { 
      headerName: '',
      field: 'id',
      width: 90,
      cellRenderer: params => 
      <IconButton onClick={() => deletebook(params.value)} size="small" color="error">
        <DeleteIcon />
      </IconButton> 
    }
  ]

  useEffect(() => {
    fetchItems();
  }, [])

  const fetchItems = () => {
    fetch('https://bookstore-d3386-default-rtdb.europe-west1.firebasedatabase.app/books/.json')
      .then(response => response.json())  // Parse the response as JSON
      .then(data => addKeys(data))
      .catch(err => console.error(err))
  }

  // Add keys to the book objects
  const addKeys = (data) => {
  const keys = Object.keys(data);
  const valueKeys = keys.map((key) => ({ ...data[key], id: key }));
  setbooks(valueKeys);
  }
   
  const addbook = (newbook) => {
    fetch('https://bookstore-d3386-default-rtdb.europe-west1.firebasedatabase.app/books/.json',
    {
      method: 'POST',
      body: JSON.stringify(newbook)
    })
    .then(response => fetchItems())
    .catch(err => console.error(err))
  }

  const deletebook = (id) => {
    fetch(`https://bookstore-d3386-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`,
    {
      method: 'DELETE',
    })
    .then(response => fetchItems())
    .catch(err => console.error(err))
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Booklist
          </Typography>
        </Toolbar>
      </AppBar> 
      <Addbook addbook={addbook} />
      <div className="ag-theme-material" style={{ height: 400, width: 1200 }}>
        <AgGridReact 
          rowData={books}
          columnDefs={columnDefs}
        />
      </div>
    </>
  );
}

export default App;