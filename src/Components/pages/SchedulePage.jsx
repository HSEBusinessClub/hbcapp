import React from 'react';
import './SchedulePage.css';
import ScheduleCard from '../ScheduleCard';
import { useEffect, useState } from 'react';


const formatTime = (start, duration) => {
  const startDate = new Date(start);
  const endDate = new Date(startDate.getTime() + duration * 60000);

  const format = (date) =>
    date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

  return `${format(startDate)} - ${format(endDate)}`;
};


const SchedulePage = () => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    fetch('https://hbcapp.ru/events/')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Ошибка загрузки');
        }
        return res.json();
      })
      .then((data) => {
        const mapped = data.map((event) => ({
          id: event.id,
          speaker_id: event.speaker_id,
          speaker_name: event.speaker_name,
          title: event.title,
          description: event.description,
          image_url: event.image_url,
          hall: event.location === 'grand_hall' ? 'Большой зал' : 'Малый зал',
          time: formatTime(event.start, event.duration),
        }));
        setSchedule(mapped);
      })
      .catch((err) => {
        console.error('Ошибка при получении расписания:', err);
      });
  }, []);

  console.log(schedule)

  return (
    <div className="schedule-page">
      <h1 className="page-title">Расписание</h1>
            {schedule.map(item => (
              <ScheduleCard key={item.id} data={item} />
            ))}
    </div>
  );
};

export default SchedulePage;
