import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  const [isFancy, setIsFancy] = useState(false);

  return (
    <div>
      { /* When you tick or clear the checkbox, the counter state does not get reset. Whether isFancy is true or false, you always have a <Counter /> as the first child of the div returned from the root App component */ }
      { /* It’s the same component at the same position, so from React’s perspective, it’s the same counter. */ }
      { /* Remember that it’s the position in the UI tree—not in the JSX markup—that matters to React! */ }
      { /* To force the state to reset, you can give a unique key to the components */ }
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}

      { /* Notice how the moment you stop rendering the second counter, its state disappears completely. That’s because when React removes a component, it destroys its state. */}
      {showB && <Counter />} 
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        Render the second counter
      </label>

      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy = false }: { isFancy?: boolean }) {
  const [score, setScore] = useState(0);
  
  return (
    <div style={ isFancy ? { border: '2px solid purple' } : {}}>
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
