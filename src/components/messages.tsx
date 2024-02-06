import { useState, useEffect } from 'react';

export const Messages = () => {
  const [message, setMessage] = useState(null);

  const BACKEND_HOST = import.meta.env.DEV ? 'http://localhost:3000' : '/api'

  useEffect(() => {
    const eventSource = new EventSource(`${BACKEND_HOST}/events`, {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      setMessage(eventData.message);
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h2>Meldinger:</h2>
      {message && <div>⚠️ {message}</div>}
      {/* Other components */}
    </div>
  );
}
