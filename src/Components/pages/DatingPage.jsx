import React, { useEffect, useState } from 'react';
import './DatingPage.css';
import TgIcon from '../../assets/tg.svg?react';
import SphereIcon from '../../assets/sphere.svg?react';
import DatingIcon from '../../assets/dating.svg?react';
import CloseIcon from '../../assets/close.svg?react';

const DatingPage = () => {
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const authHeader = {
    'Authorization': `tma ${window.Telegram.WebApp.initData}`,
  };

  const currentUserId = window.Telegram.WebApp.initDataUnsafe.user.id;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [allUsersRes, likedUsersRes] = await Promise.all([
          fetch('https://hbcapp.ru/users/', { headers: authHeader }),
          fetch('https://hbcapp.ru/users/liked', { headers: authHeader }),
        ]);

        if (!allUsersRes.ok || !likedUsersRes.ok) throw new Error('Ошибка загрузки пользователей');

        const [allUsers, likedUsers] = await Promise.all([
          allUsersRes.json(),
          likedUsersRes.json(),
        ]);

        const likedIds = new Set(likedUsers.map(u => u.id));

        const filtered = allUsers.filter(user =>
          user.dating === true &&
          user.telegram_id !== currentUserId &&
          !likedIds.has(user.id)
        ).map(user => ({
          id: user.id,
          name: user.full_name,
          age: user.age,
          tag: user.goal,
          description: user.position_description,
          instagram: user.username,
          interest: user.position_type,
          image: user.has_photo
            ? `https://hbcapp.ru/avatars/${user.telegram_id}.jpg`
            : `https://hbcapp.ru/avatars/default.jpg`
        }));

        setUsers(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const handleSwitch = async (action) => {
    if (users.length === 0) return;
    const userId = users[index].id;
    const url = `https://hbcapp.ru/users/${action}/${userId}`;

    try {
      await fetch(url, {
        method: 'POST',
        headers: authHeader,
      });
    } catch (err) {
      console.error(`Ошибка ${action} пользователя`, err);
    }

    setAnimating(true);
    setTimeout(() => {
      setUsers(prev => prev.filter((_, i) => i !== index));
      setIndex(0);
      setAnimating(false);
    }, 300);
  };

  const currentUser = users[index];

  return (
    <div className="dating-page">
      <div className="page-header">
        <h1 className="page-title">Дейтинг</h1>
        <div className="dating-btn"><DatingIcon /></div>
      </div>

      {currentUser ? (
        <div className={`card-container animated-card ${animating ? 'fade-out' : 'fade-in'}`} key={currentUser.id}>
          <img src={currentUser.image} alt={currentUser.name} className="user-image" />

          <div className="user-card">
            <div className="user-name">{currentUser.name} | {currentUser.age}</div>
            <div className="user-tag">{currentUser.tag}</div>
            <div className="user-description">{currentUser.description}</div>
            <div className="user-meta"><TgIcon /> {currentUser.instagram}</div>
            <div className="user-meta"><SphereIcon /> {currentUser.interest}</div>
          </div>
        </div>
      ) : (
        <div className="no-users">Ой, кажется, все подходящие для тебя варианты закончились<br /><br />Возможно ты найдёшь себе тех, кто нужен на лекциях</div>
      )}

      {currentUser && (
        <div className="button-row">
          <button className="btn-skip" onClick={() => handleSwitch('dislike')}><CloseIcon /></button>
          <button className="btn-next" onClick={() => handleSwitch('like')}><DatingIcon /></button>
        </div>
      )}
    </div>
  );
};

export default DatingPage;
