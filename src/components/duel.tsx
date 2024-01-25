import { useState, useEffect } from 'react';

function App() {
  const [duelResult, setDuelResult] = useState(null);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000/events');

    eventSource.onmessage = (event) => {
      console.log('event', event);
      const result = JSON.parse(event.data);
      setDuelResult(result);
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
      {duelResult && <div>Last Duel Result: {duelResult}</div>}
      {/* Other components */}
    </div>
  );
}

export default App;