import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/UserPages/Home'
import Login from './components/Login'
import MyCollection from './pages/UserPages/MyCollection'
import { useState, useEffect } from 'react'
import AddBook from './pages/AdminPages/AddBook'
import PendingRequests from './pages/AdminPages/PendingRequests'

function App() {
  const [role, setRole] = useState(() => {
    return localStorage.getItem('role') || '';
  });

  useEffect(() => {
    if (role) {
      localStorage.setItem('role', role);
    }
  }, [role]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login setRole={setRole} />} />
          <Route path='/user/home' element={<Home role={role} />} />
          <Route path='/user/collection' element={<MyCollection role={role} />} />
          <Route path='/admin/home' element={<Home role={role} />} />
          <Route path='/admin/addBook' element={<AddBook/>} />
          <Route path='/admin/pending' element={<PendingRequests role={role}/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
