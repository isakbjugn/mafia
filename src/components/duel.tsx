import { duel } from "../api/api.ts";
import { QrScanner } from '@yudiel/react-qr-scanner';
import { useRef, useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useUserStore } from "../store.ts";
import { targets } from '../api/api.ts';

export type Target = {
  id: number
  name: string,
  photoHref: string
}

export const Duel = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const user = useUserStore(state => state.user);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [duelTargets, setDuelTargets] = useState<Target[]>();

  useEffect(async () => {
    const result = await targets()
    setDuelTargets(result)
  }, [])

  const deduceClassName = (i: number) => {
    switch (i) { // ersj
      case 0: return "main-target"
      case 1: return "secondary-target"
      case 2: return "tertiary-target"
    }
  }

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
      <div>
        <h2>Dine mål</h2>
        {duelTargets &&
          <div className={'duel-targets'}>
            {duelTargets.map((target: Target, index: number): ReactNode => {
              return (
                <div className={deduceClassName(index)} key={index}>
                  <h2>Mål #{index + 1}</h2>
                  <img src={`${target.photoHref}`} alt={target.name} height={124} width={124}/>
                  <h3>{target.name}</h3>
                  <button onClick={() => duel(target.id)}>Dueller {target.name}</button>
                </div>)
            })}
          </div>
        }
        {!duelTargets &&
          <div>Laster dine mål..</div>
        }
      </div>
    </>
  )
}
