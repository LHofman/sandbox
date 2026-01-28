import { useEffect, useEffectEvent, useRef, useState } from 'react';

export const Effects = () => {
  const selectedId = useRef<string | null>(null);
  const [itemDetails, setItemDetails] = useState<{ id: string } | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (selectedId !== null) {
      fetch(`/api/items/${selectedId.current}`).then(
        data => data.json()).then(
        (data) => {
          setItemDetails(data);
        }
      );
    }
  }, [selectedId]);

  // Event listeners that need latest state without re-subscribing
  const onClick = useEffectEvent(() => {
    console.log(count);
  });

  useEffect(() => {
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('click', onClick);
    };
  }, []);

  console.log(`itemDetails: ${itemDetails}`);

  return (
    <div>
      <h2>Effects</h2>
      <button onClick={() => setCount(c => c + 1)}>Increment Count</button>
    </div>
  );
};
