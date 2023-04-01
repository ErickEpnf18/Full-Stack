import React from "react";

const Header = ({ name }) => {
  return <h2>{name}</h2>;
};
const Content = ({ parts, total }) => (
  <div>
    {parts.map((part) => (
      <Part part={part} key={part.id} />
    ))}
    <h4>total of {total} exercises</h4>
  </div>
);
const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Course = ({ courses, textHeader }) => {
  const total = (parts) => parts.reduce((s, p) => s + p.exercises, 0);

  return (
    <div>
      <h1>{textHeader}</h1>
      {courses.map((course) => (
        <div key={course.id}>
          <Header name={course.name} />
          <Content parts={course.parts} total={total(course.parts)} />
        </div>
      ))}
    </div>
  );
};

export default Course;
