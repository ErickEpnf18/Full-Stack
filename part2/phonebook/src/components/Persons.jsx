import React from 'react'

const Persons = ({ persons, handleDelete }) => {
    return (
      <div>
        {persons.length === 0 ? (
          <p>No persons</p>
        ) : (
          persons.map((person) => (
            <p key={person.id}>
              {person.name} {person.number}
              <button onClick={() => handleDelete(person.id)}>delete</button>
            </p>
          ))
        )}
      </div>
    );
  };

export default Persons
