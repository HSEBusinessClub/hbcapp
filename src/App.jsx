import React from 'react';
import {Route, Routes, useLocation} from "react-router-dom"
import './App.css'
import NavBar from './Components/NavBar';
import SchedulePage from './Components/pages/SchedulePage';
import SpeakerPage from './Components/pages/SpeakerPage';
import DatingPage from './Components/pages/DatingPage';

function App() {
  const location = useLocation();
  let tg = window.Telegram;
  tg.WebApp.expand();
  tg.WebApp.enableClosingConfirmation()

  return (
      <div className='App'>
        <meta name="viewport" content="width=device-width, user-scalable=no"></meta>
          <Routes>
            <Route index element={<SchedulePage />} />
            <Route path="/speaker/:id" element={<SpeakerPage />} />
            <Route path="/dating" element={<DatingPage />} />
          </Routes>
          <NavBar />
      </div>
  );
}

export default App;





