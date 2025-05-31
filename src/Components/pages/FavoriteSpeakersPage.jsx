import React, { useState } from "react";
import ScheduleCard from "../ScheduleCard";
import "./FavoriteSpeakersPage.css";


const recommendedSpeaker = {
    id: 2,
    speaker_name: 'ЕВГЕНИЙ ДАВЫДОВ',
    description: 'Сооснователь SETTERS',
    image_url: 'https://experum.ru/uploads/media/avatar/0001/02/thumb_1118_avatar_portrait285.jpeg',
    title: 'Приоритизация и упрощение: основа роста бизнеса, команды и тебя самого',
    hall: 'Большой зал',
    time: '10:00 - 11:00',
};

const FavoriteSpeakersPage = () => {
  const [tab, setTab] = useState("marked");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const authHeader = {
      'Authorization': `tma ${window.Telegram.WebApp.initData}`,
    };

    fetch("https://hbcapp.ru/users/favorites", { headers: authHeader })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки избранных");
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
          hall: event.location === "grand_hall" ? "Большой зал" : "Малый зал",
          time: formatTime(event.start, event.duration),
        }));
        setFavorites(mapped);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleToggleFavorite = async (eventId) => {
    const isFav = favorites.find((e) => e.id === eventId);
    const authHeader = {
      'Authorization': `tma ${window.Telegram.WebApp.initData}`,
    };

    try {
      const res = await fetch(`https://hbcapp.ru/users/favorite/${eventId}`, {
        method: isFav ? "DELETE" : "PATCH",
        headers: authHeader,
      });

      if (!res.ok) throw new Error("Ошибка при обновлении избранного");

      if (isFav) {
        setFavorites((prev) => prev.filter((e) => e.id !== eventId));
      } else {
        // Если ты хочешь просто удалить, а не добавлять заново, можешь опустить эту часть
        // Добавим, если надо будет синхронизировать с основным списком
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="favorites-page">
      <h1 className="page-title" style={{ lineHeight: "1.2" }}>Избранные спикеры</h1>
      <div className="favorites-desc">
        Здесь собраны все выступления, которые вы отметили, <br />
        а также персональные рекомендации по компаниям и нетворкингу.
      </div>
      <div className="favorites-tabs">
        <button
          className={`favorites-tab-btn${tab === "marked" ? " active" : ""}`}
          onClick={() => setTab("marked")}
        >
          Отмеченные вами выступления
        </button>
        <button
          className={`favorites-tab-btn${tab === "recommended" ? " active" : ""}`}
          onClick={() => setTab("recommended")}
        >
          Рекомендации
        </button>
      </div>
      <div className="favorites-list">
        {tab === "marked" &&
          favorites.map((event) => (
            <ScheduleCard
              key={event.id}
              data={event}
              isFavorite={true}
              onToggleFavorite={() => handleToggleFavorite(event.id)}
            />
          ))}

        {tab === "recommended" && (
          <ScheduleCard
            data={recommendedSpeaker}
            isFavorite={false}
            onToggleFavorite={() => {}}
          />
        )}
      </div>
    </div>
  );
};

const formatTime = (start, duration) => {
  const startDate = new Date(start);
  const endDate = new Date(startDate.getTime() + duration * 60000);

  const format = (date) =>
    date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  return `${format(startDate)} - ${format(endDate)}`;
};

export default FavoriteSpeakersPage;
