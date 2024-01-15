// src/App.jsr
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VehicleRegistration from './pages/VehicleRegistration';
import VehicleTracking from './pages/VehicleTracking';
import Homepage from './pages/HomePage';
import {KindeProvider} from "@kinde-oss/kinde-auth-react";
import SeederPage from './pages/SeederPage';

function App() {
  return (
    <KindeProvider
        clientId={import.meta.env.VITE_KINDE_API_KEY}
        domain={import.meta.env.VITE_KINDE_API_URL}
        logoutUri={window.location.origin}
        redirectUri={window.location.origin}
        onRedirectCallback={(user, app_state) => {
          if (app_state?.redirectTo) {
            window.location = app_state?.redirectTo;
           }
         }}
         isDangerouslyUseLocalStorage={true}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/register" element={<VehicleRegistration />} />
          <Route path="/track" element={<VehicleTracking />} />
          <Route path="/seed" element={<SeederPage />} />
        </Routes>
      </Router>
        
    </KindeProvider>
  );
}

export default App;