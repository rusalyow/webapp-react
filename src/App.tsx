import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [radiusData, setRadiusData] = useState([]);
  const [userId, setUserId] = useState(null); // 143937122 на useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState(0); // 0 - Сегодня, 6 - Неделя, 30 - Месяц

  useEffect(() => {
    const Telegram = (window as any).Telegram;

    if (Telegram && Telegram.WebApp) {
      const user = Telegram.WebApp.initDataUnsafe?.user || {};

      setUsername(user.username || 'Неизвестный пользователь');
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setUserId(user.id || null);

      fetchData(0); // Загружаем данные за "Сегодня" по умолчанию
    }
  }, []);

  // Функция для загрузки данных с сервера
  const fetchData = (period) => {
    const id = userId || 143937122; // Если userId не определено, используем 143937122
    const url = `http://127.0.0.1:8080/${id}/${period}`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных');
        }
        return response.json();
      })
      .then((data) => {
        if (data.message) {
          alert(`Ошибка: ${data.message}`);
          return;
        }

        const radiusArray = Object.entries(data).map(([radius, status]) => ({
          radius,
          status,
        }));
        setRadiusData(radiusArray);
      })
      .catch((error) => {
        console.error('Ошибка:', error);
      });
  };

  // Функция для выбора периода
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    fetchData(period); // Загружаем данные за выбранный период
  };

  // Функция для изменения статуса радиуса
  const toggleStatus = (radius) => {
    if (selectedPeriod !== 0) {
      alert('Статус можно менять только при выборе "Сегодня".');
      return;
    }

    setRadiusData((prev) =>
      prev.map((item) =>
        item.radius === radius ? { ...item, status: item.status === 0 ? 1 : 0 } : item
      )
    );
    const id = userId || 143937122; // Используем userId или значение по умолчанию
    const url = `http://127.0.0.1:8080/toggle-status`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ radius, userId: id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка отправки команды');
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.newStatus !== undefined) {
          setRadiusData((prev) =>
            prev.map((item) =>
              item.radius === radius ? { ...item, status: data.newStatus } : item
            )
          );
        } else {
          console.error('Ошибка: сервер не вернул новый статус');
        }
      })
      .catch((error) => {
        console.error('Ошибка:', error);
      });
  };

  // Определяем цвет статуса
  const getStatusColor = (status) => {
    return status === 0 ? 'green' : 'red';
  };

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

      <h2>Выберите период:</h2>
      <div style={{ marginBottom: '20px' }}>
        <button
          style={{ margin: '0 5px' }}
          onClick={() => handlePeriodChange(0)}
          disabled={selectedPeriod === 0}
        >
          Сегодня
        </button>
        <button
          style={{ margin: '0 5px' }}
          onClick={() => handlePeriodChange(6)}
          disabled={selectedPeriod === 6}
        >
          Неделя
        </button>
        <button
          style={{ margin: '0 5px' }}
          onClick={() => handlePeriodChange(30)}
          disabled={selectedPeriod === 30}
        >
          Месяц
        </button>
      </div>

      <h2>Статус радиусов:</h2>
      <ul>
        {radiusData.map((item, index) => (
          <li
            key={index}
            style={{ color: getStatusColor(item.status), cursor: 'pointer' }}
            onClick={() => toggleStatus(item.radius)}
          >
            <strong>{item.radius}</strong> : {item.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
