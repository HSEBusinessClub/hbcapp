import React, { useEffect, useState } from 'react';
import './PartnersPage.css';

const PartnersPage = () => {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    fetch('https://hbcapp.ru/partners/')
      .then((res) => res.json())
      .then((data) => {
        setPartners(data);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке партнёров:', error);
      });
  }, []);

  return (
    <div className="partners-page">
      <h1 className="page-title">Бизнес квест</h1>
      <p style={{ marginBottom: '16px' }}>
        Проходи интерактивные стенды партнёров, отвечай на вопросы и получай призы
      </p>
      {partners.map((partner) => (
        <div className="partner-card" key={partner.id}>
          <img
            src={
              partner.logo_url
            }
            alt={partner.name}
            className="partner-image"
          />
          <div className="partner-description">
            <div className="partner-name">{partner.name}</div>
            <p>Прослушайте лекцию партнёра на стенде и получите QR-код для зачтения прохождения</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PartnersPage;
