import { useState } from "react";

const StatisticLine = ({ text, value }) => (
  <tbody>
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  </tbody>
);

const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  if (all === 0) return <p>No feedback given</p>;
  return (
    <table>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="all" value={all} />
      <StatisticLine text="average" value={average} />
      <StatisticLine text="positive" value={positive} />
    </table>
  );
};

const Button = ({ text, setToStatistic }) => (
  <button onClick={setToStatistic}>{text}</button>
);

const App = () => {

  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);
  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState(0);


  const setToStatistic = (who) => () => {
    let newFeedback = 0;
    let newAllFeedback = 0;
    let newAverage = 0;

    if (who === "good") {
      newFeedback = good + 1;
      newAllFeedback = newFeedback + neutral + bad;
      newAverage = (newFeedback - bad) / 3;

      setGood(newFeedback);
      setAll(newAllFeedback);
      setAverage(newAverage);
      setPositive((100 * newFeedback) / newAllFeedback);
    }
    if (who === "neutral") {
      newFeedback = neutral + 1;
      newAllFeedback = newFeedback + good + bad;

      setNeutral(newFeedback);
      setAll(newAllFeedback);
      setPositive((100 * good) / newAllFeedback);
    }
    if (who === "bad") {
      newFeedback = bad + 1;
      newAllFeedback = newFeedback + good + neutral;
      newAverage = (good - newFeedback) / 3;

      setBad(newFeedback);
      setAll(newAllFeedback);
      setAverage(newAverage);
      setPositive((100 * good) / newAllFeedback);
    }
  };



  return (
    <div>
      <h1>give feedback</h1>
      <Button setToStatistic={setToStatistic("good")} text="good" />
      <Button setToStatistic={setToStatistic("neutral")} text="neutral" />
      <Button setToStatistic={setToStatistic("bad")} text="bad" />
      <h1>statistics</h1>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        average={average}
        positive={positive}
      />

    </div>
  );
};

export default App;
