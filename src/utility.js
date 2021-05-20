import { Clock } from 'three';

export function useRequestAnimationFrame(callback) {
  let isRunning = true;

  const clock = new Clock();

  function tick() {
    callback(clock.getElapsedTime());
    if (isRunning) {
      requestAnimationFrame(tick);
    }
  }
  requestAnimationFrame(tick);

  function stop() {
    isRunning = false;
  }

  return stop;
}
