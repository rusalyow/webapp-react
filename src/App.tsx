import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    // Проверяем, доступен ли Telegram Web App API
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user || {};

      setUsername(user.username || 'Неизвестный пользователь');
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Информация о пользователе Telegram:</h1>
      <p>
        <strong>Имя:</strong> {firstName}
      </p>
      <p>
        <strong>Фамилия:</strong> {lastName}
      </p>
      <p>
        <strong>Имя пользователя:</strong> {username}
      </p>
    </div>
  );
}

export default App;
