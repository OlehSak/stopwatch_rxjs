import { useRef, useEffect, useState } from "react"
import { fromEvent, interval, merge, NEVER } from 'rxjs';
import { mapTo, scan, startWith, switchMap, tap, buffer, debounceTime, map, filter } from 'rxjs/operators';

const App = () => {
  const [time, setTime] = useState(0);

  const start = useRef<HTMLButtonElement>(null);
  const pause = useRef<HTMLButtonElement>(null);
  const reset = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const startValues = {
      count: false,
      speed: 1000,
      value: 0,
    }

    if (start.current && start && pause.current && reset.current) {
      const pause$ = fromEvent(pause.current, 'click');
      const start$ = fromEvent(start.current, 'click');

      const buff$ = pause$.pipe(
        debounceTime(250),
      )

      const events = merge(
        start$.pipe(
          buffer(start$.pipe(
            debounceTime(250),
          )),
          map(list => {
            return list.length;
          }),
          filter(x => x === 2),
          mapTo({ count: false, value: 0, speed: 0 }),
        ),
        start$.pipe(mapTo({ count: true })),
        pause$.pipe(
          buffer(buff$),
          map(list => {
            return list.length;
          }),
          filter(x => x === 2),
          mapTo({ count: false })),
        pause$.pipe(mapTo({ count: true })),
        fromEvent(reset.current, 'click').pipe(mapTo({ value: 0 })),
      );

      const stopWatch = events.pipe(
        startWith(startValues),
        scan((state: any, curr): any => ({ ...state, ...curr }), 0),
        tap((state: any) => setTime(state.value++)),
        switchMap((state: any) =>
          state.count ? interval(state.speed).pipe(
            tap(_ => setTime(state.value++)),
          ) : NEVER
        )
      );

      stopWatch.subscribe();
    }
  }, []);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>{new Date(time * 1000).toISOString().substr(11, 8)}</div>
      <div id="controls">
        <button id="start" ref={start}>Start / Stop</button>
        <button id="pause" ref={pause}>pause</button>
        <button id="reset" ref={reset}>reset</button>
      </div>
    </>
  );
}

export default App;
