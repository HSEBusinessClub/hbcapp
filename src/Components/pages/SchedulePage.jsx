import React, { useEffect, useState } from 'react';
import './SchedulePage.css';
import ScheduleCard from '../ScheduleCard';

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
  const [favorites, setFavorites] = useState(new Set());
  const authHeader = { Authorization: `tma ${window.Telegram.WebApp.initData}` };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, favRes] = await Promise.all([
          fetch('https://hbcapp.ru/events/'),
          fetch('https://hbcapp.ru/users/favorites', { headers: authHeader }),
        ]);

        if (!eventsRes.ok || !favRes.ok) throw new Error('Ошибка загрузки');

        const [events, favIds] = await Promise.all([eventsRes.json(), favRes.json()]);

        const mapped = events.map((event) => ({
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
        setFavorites(new Set(favIds.map(event => event.id)));
      } catch (err) {
        console.error('Ошибка при получении данных:', err);
      }
    };

    fetchData();
  }, []);

  const toggleFavorite = async (eventId) => {
    const isFav = favorites.has(eventId);
    const method = isFav ? 'DELETE' : 'PATCH';

    try {
      const res = await fetch(`https://hbcapp.ru/users/favorite/${eventId}`, {
        method,
        headers: {
          ...authHeader,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Ошибка обновления избранного');

      setFavorites((prev) => {
        const updated = new Set(prev);
        if (isFav) {
          updated.delete(eventId);
        } else {
          updated.add(eventId);
        }
        return updated;
      });
    } catch (err) {
      console.error('Не удалось обновить избранное:', err);
    }
  };

  return (
    <div className="schedule-page">
      <h1 className="page-title">Расписание</h1>
      {schedule.map((item) => (
        <ScheduleCard
          key={item.id}
          data={item}
          isFavorite={favorites.has(item.id)}
          onToggleFavorite={() => toggleFavorite(item.id)}
        />
      ))}
    </div>
  );
};

export default SchedulePage;
