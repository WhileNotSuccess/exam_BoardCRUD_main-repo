import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import User from "./pages/User"
import Main from "./pages/Main"
import Nav from "./components/Nav"
import UserPage from "./pages/UserPage"
import SearchResult from "./pages/SearchResult"
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
      
      
    </Routes>
    </BrowserRouter>
  </>
    
  )
}

export default App
