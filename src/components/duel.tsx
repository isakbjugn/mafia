import { duel } from "../api/api.ts";
import { QrScanner } from '@yudiel/react-qr-scanner';
import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useUserStore } from "../store.ts";

export const Duel = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const user = useUserStore(state => state.user);
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
      {user && <button onClick={() => dialogRef.current?.showModal()}>🆚 QR-kode</button>}
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
      {user &&
        <dialog ref={dialogRef}>
          <QRCode value={user.id.toString()}/>
          <form method="dialog">
            <button autoFocus type="submit">❌ Lukk</button>
          </form>
        </dialog>
      }
    </>
  )
}
