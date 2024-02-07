import { useEffect } from "react";
import './targets.css';
import { Target, useTargetStore } from "../../store.ts";

export const Targets = () => {
  const targets = useTargetStore(state => state.targets);
  const fetchTargets = useTargetStore(state => state.fetchTargets);

  useEffect(() => {
    fetchTargets();
  }, [fetchTargets])

  const targetClassNames = ['main-target', 'secondary-target', 'tertiary-target'];

  return (
    <>
    {targets && targets.length !== 0 &&
        <>
      <h2>Dine mål</h2>
        <div className={'duel-targets'}>
          {targets.map((target: Target, index: number) =>  (
              <div className={targetClassNames[index]} key={index}>
                <h2>Mål #{index + 1}</h2>
                <img src={`${target.photoHref}`} alt={target.name} height={124} width={124}/>
                <h3>{target.name}</h3>
              </div>
          ))}
        </div>
        </>
      }
      {!targets &&
        <div>Laster dine mål..</div>
      }
      {targets && targets.length === 0 &&
          <>
            <h2>🎉 🥂 🍾 Gratulerer! 🍾 🥂 🎉</h2>
            <div>💪💪 Du er en overlever 💪💪</div>
          </>
      }
    </>
  )
}