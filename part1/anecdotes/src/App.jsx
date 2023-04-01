import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

const Button = ({ text, setEventHandler }) => (
  <button onClick={setEventHandler}>{text}</button>
);

const Anecdotes = ({ text, anecdotes, votes }) => (
  <div>
    <h1>{text}</h1>
    {anecdotes}
    <p>has {votes} votes</p>
  </div>
);

function App() {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length));

  const selectAnecdote = () => {
    const random = () => Math.floor(Math.random() * anecdotes.length);
    let number_random = random();
    while (selected === number_random) {
      number_random = random();
    }
    console.log(number_random);
    setSelected(number_random);
  };

  const voteAnecdote = () => {
    const copy = [...votes];
    copy[selected] += 1;
    setVotes(copy);
    // console.log(copy, selected);
  };

  const indexOfMaxValue = () => {
    const max = Math.max(...votes);
    if(max === 0) return -1
    return votes.findIndex((anec) => anec === max);
  };

  return (
    <div className="App">
      <Anecdotes
        anecdotes={anecdotes[selected]}
        votes={votes[selected]}
        text="Anecdote of the day"
      />
      <div>
        <Button setEventHandler={voteAnecdote} text="vote" />
        <Button setEventHandler={selectAnecdote} text="next anecdote" />
      </div>

      <Anecdotes
        anecdotes={anecdotes[indexOfMaxValue()]}
        votes={votes[indexOfMaxValue()]}
        text="Anecdote with most votes"
      />
    </div>
  );
}

export default App;
