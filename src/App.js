import './App.css';
import NewProcess from './views/newProcess';
import Welcome from './views/welcome';
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import ProcessList from './views/processList';
import ProcessStructure from './views/procesStructure';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Welcome />}></Route>
        <Route path='/newP' element={<NewProcess />}/>
        <Route path="/procesos" element={<ProcessList />} />
        <Route path="/pros" element={<ProcessStructure />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
