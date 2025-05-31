import React, { useState, useEffect } from "react";
import ScheduleCard from "../ScheduleCard";
import "./FavoriteSpeakersPage.css";


const recommendedSpeakers = [
    {
    id: 2,
    speaker_name: 'Ринат Алиев',
    description: 'основатель Educate Online',
    image_url: 'https://hubspeakers.ru/img/speakers/rinat-aliev/m.jpg',
    title: 'Как построить команду с 0 и не потерять ее до первых результатов?',
    hall: 'Большой зал',
    time: '10:30 - 11:15',
    },
    {
    id: 4,
    speaker_name: 'Александр Дубовенко',
    description: 'основатель GOOD WOOD',
    image_url: 'https://ddom.ru/plugins/phpthumb/phpThumb.php?src=/images/photos/medium/map556.jpg&w=378&h=283&zc=1',
    title: 'Самоуправляемы организации. Agile и SCRUM в оффлайн-бизнесах',
    hall: 'Большой зал',
    time: '12:15 - 13:00',
    },
    {
    id: 9,
    speaker_name: 'Антон Макаров',
    description: 'основатель «Диван.ру»',
    image_url: 'https://cdn.forbes.ru/forbes-static/new/2022/04/4-62603365636fb.jpg',
    title: 'От 0 до 10: как за 10 лет вырастить одного из лидеров отрасли и достигнуть выручки в 10 млрд',
    hall: 'Большой зал',
    time: '17:45 - 18:30',
    },

];

const FavoriteSpeakersPage = () => {
  const [tab, setTab] = useState("recommended");
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
          recommendedSpeakers.map((recommendedSpeaker) => (
            <ScheduleCard
              key={recommendedSpeaker.id}
              data={recommendedSpeaker}
              isFavorite={false}
              onToggleFavorite={() => {}}
            />
          ))
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
