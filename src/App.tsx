import React, { useRef, useEffect } from "react"
import { fromEvent, interval, merge, noop, NEVER } from 'rxjs';
import { map, mapTo, scan, startWith, switchMap, tap } from 'rxjs/operators';

const App = () => {
  const counter = useRef<HTMLElement>(null);

  const start = useRef<HTMLButtonElement>(null);
  const pause = useRef<HTMLButtonElement>(null);
  const reset = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (start && pause && reset && counter && start.current && pause.current && reset.current && counter.current) {
      const events$ = merge(
        fromEvent(start.current, 'click').pipe(mapTo({ count: true })),
        fromEvent(pause.current, 'click').pipe(mapTo({ count: false })),
        fromEvent(reset.current, 'click').pipe(mapTo({ value: 1 })),
      );

      const setValue = (val: number) => {
        if (null !== counter.current) {
          (counter.current.innerText = val.toString());
        }
      }

      const stopWatch$ = events$.pipe(
        startWith({value: 0, count: false}),
          map(state => console.log(state))
      );

      stopWatch$.subscribe();
    }
  }, []);

  return (
    <>
      <div id="counter">0</div>
      <div id="controls">
        <button id="start" ref={start}>start</button>
        <button id="pause" ref={pause}>pause</button>
        <button id="reset" ref={reset}>reset</button>
      </div>
    </>
  );
}

export default App;
