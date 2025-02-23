import './App.css';
import NewProcess from './views/newProcess';
import Welcome from './views/welcome';
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import ProcessList from './views/processList';
import Entity from './views/entity';
import UserManagement from './views/usersList';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Welcome />}></Route>
        <Route path='/newP' element={<NewProcess />}/>
        <Route path="/procesos" element={<ProcessList />} />
        <Route path="/entidad" element={<Entity />} />
        <Route path="/users" element={<UserManagement />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
