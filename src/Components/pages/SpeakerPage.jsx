// SpeakerPage.jsx
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './SpeakerPage.css';
import HeartIcon from '../../assets/navbar/heart.svg?react';
import ClockIcon from '../../assets/timeb.svg?react';
import LocationIcon from '../../assets/locationb.svg?react';
import ArrowIcon from '../../assets/arrowb.svg?react';

const formatToGoogleDate = (startStr, durationMin) => {
  const localStart = new Date(startStr);
  const utcStart = new Date(localStart.getTime() - localStart.getTimezoneOffset() * 60000);
  const utcEnd = new Date(utcStart.getTime() + durationMin * 60000);

  const format = (d) =>
    d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  return `${format(utcStart)}/${format(utcEnd)}`;
};

const SpeakerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { speaker } = location.state || {};

  const speakerLinks = {
    6: "https://secrets.tbank.ru/lichnyj-opyt/intervyu-sergeya-lebedeva/?utm_referrer=https%3A%2F%2Fwww.google.com%2F",
    7: "https://www.forbes.ru/healthcare/534234-smena-galsa-kak-osnovatel-lenty-sozdal-odnogo-iz-liderov-rossijskoj-farmindustrii",
    8: "https://www.forbes.ru/profile/vladimir-evtushenkov",
    9: "https://secrets.tbank.ru/lichnyj-opyt/anton-makarov-intervy/",
    10: "https://www.forbes.ru/biznes/422885-lomat-i-stroit-kak-osnovateli-vseinstrumentyru-vyrastili-konkurenta-ikea-i-leroy",
    11: "https://www.forbes.ru/profile/358987-amiran-mucoev",
    12: "https://events.vedomosti.ru/speakers/bliznuk-stanislav-1245",
    20: "https://www.forbes.ru/profile/339991-dmitriy-kalaev"
  };

  if (!speaker) {
    return <div>Информация о спикере недоступна</div>;
  }

  const googleCalendarUrl = new URL("https://calendar.google.com/calendar/u/0/r/eventedit");
  googleCalendarUrl.searchParams.set("action", "TEMPLATE");
  googleCalendarUrl.searchParams.set("text", "Форум Бизнес-Клуба НИУ ВШЭ 2025");
  if (speaker.start && speaker.duration) {
    googleCalendarUrl.searchParams.set("dates", formatToGoogleDate(speaker.start, speaker.duration));
  }
  googleCalendarUrl.searchParams.set("details", speaker.title || "Выступление спикера");
  googleCalendarUrl.searchParams.set("location", speaker.hall || "Площадка форума");

  return (
    <div className="speaker-page">
      <h1 className="page-title">О спикере</h1>
      <div className="speaker-card-full">
        <img src={speaker.image_url} alt={speaker.speaker_name} className="speaker-image-full" />

        <div className="speaker-info-full">
          <div className="speaker-main-info">
            <div className="speaker-name-full">{speaker.speaker_name}</div>
            <div className="speaker-position-full">{speaker.description}</div>
          </div>
        </div>

        <div className="speaker-talk-full">{speaker.title}</div>

        <div className="speaker-tag-full">
          <div className="tag-full"><LocationIcon /> {speaker.hall}</div>
          <div className="tag-full">{/*Как пройти в зал <ArrowIcon/>*/}</div>
        </div>

        <div className="speaker-tag-full">
          <div className="tag-full"><ClockIcon /> {speaker.time}</div>
          <div className="tag-full">
            <a
              href={googleCalendarUrl.toString()}
              target="_blank"
              rel="noopener noreferrer"
              className="calendar-link"
              style={{ color: '#000', fontSize: '16px' }}
            >
              Напомнить о событии <ArrowIcon />
            </a>
          </div>
        </div>

        {speakerLinks[speaker.id] && (
            <a
              href={speakerLinks[speaker.id]}
              target="_blank"
              rel="noopener noreferrer"
              className="speaker-button"
            >
              Узнать больше о спикере
            </a>
          )}
      </div>
    </div>
  );
};

export default SpeakerPage;
