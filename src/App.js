import './App.css';
import NewProcess from './views/newProcess';
import Welcome from './views/welcome';
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import ProcessList from './views/processList';
import Header from './components/Header';
import Footer from './components/Footer';


function App() {

  return (
    
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path='/' element={<Welcome />}></Route>
        <Route path='/newP' element={<NewProcess />}/>
        <Route path="/procesos" element={<ProcessList />} />
      </Routes>
<Footer />
    </BrowserRouter>
    
  )
}

export default App
