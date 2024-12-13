import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import User from "./pages/User"
import Main from "./pages/Main"
import Post from "./pages/Post"
import ImageUpload from "./test/ImageUpload"
import Nav from "./components/Nav"
import UserPage from "./pages/UserPage"
import SearchResult from "./pages/SearchResult"
import ListIn from "./pages/Listin"
import PostUpdate from "./pages/PostUpdate"
function App() {
  return(
  <>
    
    <BrowserRouter>
    <Nav />
    <Routes>
      <Route  path="/" element={<Main/>}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/user" element={<User />}/>
      <Route path="/user-page" element={<UserPage />}/>
      <Route path="/search-result" element={<SearchResult />}/>
      <Route path="/post" element={<Post />}/>
      <Route path="/image-test" element={<ImageUpload />}/>
      <Route path="/post/:id" element={<ListIn />}/>
      <Route path="/post-update/:id" element={<PostUpdate/>}/>
    </Routes>
    </BrowserRouter>
  </>
    
  )
}

export default App
