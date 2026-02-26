import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Admin from './pages/Admin';
import Success from './pages/Success';
import Failure from './pages/Failure';
import Missions from './pages/Missions';
import GetInvolved from './pages/GetInvolved';
import Gallery from './pages/Gallery';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import VolunteerEnrollment from './pages/VolunteerEnrollment';
import InternshipEnrollment from './pages/InternshipEnrollment';
import LegalAid from './pages/LegalAid';
import LegalStatus from './pages/LegalStatus';
import PatronKnowMore from './pages/PatronKnowMore';
import VolunteerKnowMore from './pages/VolunteerKnowMore';

function App() {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '103683072847-example.apps.googleusercontent.com';

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/missions" element={<Missions />} />
                        <Route path="/get-involved" element={<GetInvolved />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/volunteer-enrollment" element={<VolunteerEnrollment />} />
                        <Route path="/internship-enrollment" element={<InternshipEnrollment />} />
                        <Route path="/legal-aid" element={<LegalAid />} />
                        <Route path="/legal-status" element={<LegalStatus />} />
                        <Route path="/patron-know-more" element={<PatronKnowMore />} />
                        <Route path="/volunteer-know-more" element={<VolunteerKnowMore />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/success" element={<Success />} />
                        <Route path="/failure" element={<Failure />} />
                    </Routes>
                </Layout>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
