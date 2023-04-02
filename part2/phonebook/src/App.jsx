import { useState } from "react";

const Filter = ({ handleSearch, search }) => (
  <div>
    filter shown with:
    <input name="name" onChange={handleSearch} value={search} />
  </div>
);

const PersonForm = ({ submit, handleChange, newName }) => (
  <form onSubmit={submit}>
    <div>
      name:
      <input name="name" onChange={handleChange} value={newName.name} />
    </div>
    <div>
      number:
      <input name="number" onChange={handleChange} value={newName.number} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Persons = ({ persons }) => {
  return (
    <div>
      {persons.length === 0 ? (
        <p>No persons</p>
      ) : (
        persons.map((person) => (
          <p key={person.id}>
            {person.name} {person.number}
          </p>
        ))
      )}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState({ name: "", number: "" });
  const [search, setSearch] = useState("");
  const [personsFilter, setPersonsFilter] = useState([]);

  const submit = (e) => {
    e.preventDefault();
    if (newName.name === "" || newName.number === "") {
      alert(`field can't be empty to phonebook`);
      return;
    }
    const verifiedName = persons.find(
      (x) => x.name === newName.name || x.number === newName.number
    );
    if (verifiedName) {
      alert(
        `${newName.name} or ${newName.number} is already added to phonebook`
      );
      return;
    }
    const newPerson = {
      name: newName.name,
      number: newName.number,
      id: persons.length + 1,
    };
    setPersons(persons.concat(newPerson));
  };

  const handleChange = ({ target }) => {
    setNewName({ ...newName, [target.name]: target.value });
  };

  const handleSearch = ({ target }) => {
    const searchPerson = persons.filter(
      ({ name }) => name.toLowerCase().indexOf(target.value) !== -1
    );
    setPersonsFilter(searchPerson);
    setSearch(target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter handleSearch={handleSearch} search={search} />

      <h3>Add a new</h3>

      <PersonForm
        submit={submit}
        handleChange={handleChange}
        newName={newName}
      />

      <h3>Numbers</h3>

      <Persons persons={search === "" ? persons : personsFilter} />
    </div>
  );
};

export default App;
