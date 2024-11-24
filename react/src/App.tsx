import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import User from "./pages/User"
import Main from "./pages/Main"

function App() {
  return(
    <BrowserRouter>
    <Routes>
      <Route  path="/" element={<Main/>}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/user" element={<User />}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App
