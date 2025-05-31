// SpeakerPage.jsx
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './SpeakerPage.css';
import HeartIcon from '../../assets/navbar/heart.svg?react';
import ClockIcon from '../../assets/timeb.svg?react';
import LocationIcon from '../../assets/locationb.svg?react';
import ArrowIcon from '../../assets/arrowb.svg?react';

const formatToGoogleDate = (startStr, durationMin) => {
  const start = new Date(startStr);
  const end = new Date(start.getTime() + durationMin * 60000);

  const format = (d) =>
    d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  return `${format(start)}/${format(end)}`;
};

const SpeakerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { speaker } = location.state || {};

  const googleCalendarUrl = new URL("https://calendar.google.com/calendar/u/0/r/eventedit");
  googleCalendarUrl.searchParams.set("text", speaker.title || "Событие форума");
  if (speaker.start && speaker.duration) {
    googleCalendarUrl.searchParams.set("dates", formatToGoogleDate(speaker.start, speaker.duration));
  }
  googleCalendarUrl.searchParams.set("details", speaker.description);
  googleCalendarUrl.searchParams.set("location", speaker.hall || "Площадка форума");

  return (
    <div className="speaker-page">
      <h1 className="page-title">О спикере</h1>
      <div className="speaker-card-full">
        <img src={speaker.image_url} alt={speaker.speaker_name} className="speaker-image-full" />

        <div className='speaker-info-full'>
          <div className='speaker-main-info'>
            <div className="speaker-name-full">{speaker.speaker_name}</div>
            <div className="speaker-position-full">{speaker.description}</div>
          </div>
          {/*<div className="favorite-icon-full"><HeartIcon /></div>*/}
        </div>

        <div className="speaker-talk-full">{speaker.title}</div>

        <div className='speaker-tag-full'>
          <div className='tag-full'><LocationIcon /> {speaker.hall}</div>
          <div className='tag-full'>{/*Как пройти в зал <ArrowIcon/>*/}</div>
        </div>

        <div className='speaker-tag-full'>
          <div className='tag-full'><ClockIcon /> {speaker.time}</div>
          <div className='tag-full'>
            <a
              href={googleCalendarUrl.toString()}
              target="_blank"
              rel="noopener noreferrer"
              className="calendar-link"
            >
              Напомнить о событии <ArrowIcon />
            </a>
          </div>
        </div>

        {/*<button className="speaker-button">Узнать больше о спикере</button>*/}
      </div>
    </div>
  );
};

export default SpeakerPage;
