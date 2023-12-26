import Navbar from "./components/navbar.component";
import { Routes, Route } from "react-router-dom";
import UserAuthForm from "./pages/userAuthForm.page";
const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Navbar/>}>

                <Route path="signIn" element={<UserAuthForm type="sign-in"/> } />
                <Route path="signUp" element={<UserAuthForm type="sign-up" /> } />
            
            </Route>
        </Routes>
    )
}

export default App;