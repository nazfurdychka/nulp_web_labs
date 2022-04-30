import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import Login from './Pages/Login';
import Home from './Pages/Home';
import Registration from './Pages/Registration';
import Profile from './Pages/Profile';


function App() {
    return (
        <Router>
            <Routes>
                <Route exact path='/login' element={<Login />}/>
                <Route exact path='/' element={<Home />}/>
                <Route exact path='/registration' element={<Registration />}/>
                <Route exact path='/profile' element={<Profile />}/>
            </Routes>
        </Router>
    );
}

export default App;
