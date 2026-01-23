import { useState } from 'react';

export const Form = () => {
  const [canSubmit, setCanSubmit] = useState(false);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setCanSubmit(text.trim().length > 0);
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" onChange={handleTextChange}/>
      { canSubmit && <button type="submit">Add Task</button> }
    </form>
  );
}