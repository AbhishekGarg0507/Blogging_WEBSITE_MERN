import Navbar from "./components/navbar.component";
import { Routes, Route } from "react-router-dom";
const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Navbar/>}>

                <Route path="signIn" element={<h1>SignIn page</h1>}/>
                <Route path="signUp" element={<h1>Signup page</h1>}/>
            
            </Route>
        </Routes>
    )
}

export default App;