import { useState, useEffect } from 'react';

export const Messages = () => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000/events', {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      console.log('event', event);
      const result = JSON.parse(event.data);
      setMessage(result.message);
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
