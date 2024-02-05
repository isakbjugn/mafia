import { duel } from "../api/api.ts";
import { QrScanner } from '@yudiel/react-qr-scanner';
import { useState } from "react";

export const Duel = () => {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleDecode = (result: string) => {
    duel(parseInt(result)).catch(e => {
      if (e.status === 403) {
        setError('Dette er ikke en av dine mål!')
      }
    });
    setCameraOpen(false)
  }

  return (
    <>
      <button onClick={() => setCameraOpen(!cameraOpen)}>📷 Dueller!</button>
      {cameraOpen &&
        <>
          <button onClick={() => setCameraOpen(false)}>⏹️</button>
          <QrScanner
            onDecode={handleDecode}
            onError={(error) => console.log(error?.message)}
          />
        </>
      }
      {error && <p>⚠️ {error}</p>}
    </>
  )
}
