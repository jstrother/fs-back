export function createLoopedTimer(array, callback, time, repeat = false) {
  let index = 0;
  const TOTAL = array.length;

  const executeCallback = () => {
    const itemId = repeat ? array[index]?.id : array[index];
    callback(itemId);

    index++;
    if (index >= TOTAL) {
      if (repeat) {
        index = 0;
      } else {
        return;
      }
    }

    setTimeout(executeCallback, time);
  };

  executeCallback();
}