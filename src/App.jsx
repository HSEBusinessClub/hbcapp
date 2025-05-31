import React from 'react';
import {Route, Routes, useLocation} from "react-router-dom"
import './App.css'
import NavBar from './Components/NavBar';
import SchedulePage from './Components/pages/SchedulePage';
import SpeakerPage from './Components/pages/SpeakerPage';
import DatingPage from './Components/pages/DatingPage';
import FavoriteSpeakersPage from './Components/pages/FavoriteSpeakersPage';
import QAPage from './Components/pages/QAPage';

function App() {
  const location = useLocation();
  let tg = window.Telegram;
  console.log('Telegram WebApp:', tg);
  tg.WebApp.expand();
  tg.WebApp.enableClosingConfirmation()

  return (
      <div className='App'>
        <meta name="viewport" content="width=device-width, user-scalable=no"></meta>
          <Routes>
            <Route index element={<SchedulePage />} />
            <Route path="/speaker/:id" element={<SpeakerPage />} />
            <Route path="/dating" element={<DatingPage />} />
            <Route path="/favorites" element={<FavoriteSpeakersPage />} />
            <Route path="/qa" element={<QAPage />} />
          </Routes>
          <NavBar />
      </div>
  );
}

export default App;





