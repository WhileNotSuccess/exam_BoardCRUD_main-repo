import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import User from "./pages/User"
import Main from "./pages/Main"
import Post from "./pages/Post"
import ImageUpload from "./test/ImageUpload"

function App() {
  return(
    <BrowserRouter>
    <Routes>
      <Route  path="/" element={<Main/>}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/user" element={<User />}/>
      <Route path="/post" element={<Post />}/>
      <Route path="/image-test" element={<ImageUpload />}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App
