import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom';

import Login from './Pages/LoginPage/Login';
import Registration from './Pages/RegistrationPage/Registration';
import Profile from './Pages/ProfilePage/Profile';
import Courses from './Pages/CoursesPage/Courses';
import Requests from './Pages/RequestsPage/Requests';

function App() {

    return (
        <Router>
            <Routes>
                <Route exact path="/registration" element={<Registration/>}/>
                <Route exact path="/login" element={<Login/>}/>
                <Route exact path="/profile" element={<Profile/>}/>
                <Route exact path="/requests" element={<Requests/>}/>
                <Route exact path="/courses" element={<Courses/>}/>
            </Routes>
        </Router>
    );
}

export default App;
