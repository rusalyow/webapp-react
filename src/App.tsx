import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    // Указываем тип `any` для `window.Telegram`, чтобы избежать ошибок
    const Telegram = (window as any).Telegram;

    if (Telegram && Telegram.WebApp) {
      const user = Telegram.WebApp.initDataUnsafe?.user || {};

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
