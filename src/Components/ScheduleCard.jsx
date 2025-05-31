import React from 'react';
import './ScheduleCard.css';
import { Link } from 'react-router-dom';
import HeartIcon from '../assets/navbar/heart.svg?react';
import FilledHeartIcon from '../assets/heart-filled.svg?react';

const ScheduleCard = ({ data, isFavorite, onToggleFavorite }) => {
  return (
    <div className="schedule-card">
      <Link to={`/speaker/${data.id}`} state={{ speaker: data }} className="schedule-card-link">
        <div className="speaker-section">
          <img className="speaker-image" src={data.image_url} alt={data.title} />
          <div className="speaker-info">
            <div className="speaker-name">{data.speaker_name}</div>
            <div className="speaker-position">{data.description}</div>
            <div className="talk-title">“{data.title}”</div>
            <div className="tags">
              <div className="tag-location">{data.hall}</div>
              <div className="tag-time">{data.time}</div>
            </div>
          </div>
        </div>
      </Link>
      <div className="favorite-icon" onClick={onToggleFavorite}>
        {isFavorite ? <FilledHeartIcon /> : <HeartIcon />}
      </div>
    </div>

  );
};

export default ScheduleCard;

