import { useState, useEffect } from "react";
import personService from "./services/persons";

import "./App.css";
import PersonForm from "./components/PersonForm";
import Notification from "./components/Notification";
import Filter from "./components/Filter";
import Persons from "./components/Persons";









const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState({ name: "", number: "" });
  const [search, setSearch] = useState("");
  const [personsFilter, setPersonsFilter] = useState([]);
  const [message, setMessage] = useState(null);

  const hook = () => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  };

  useEffect(hook, []);

  const submit = (e) => {
    e.preventDefault();
    if (newName.name === "" || newName.number === "") {
      alert(`name or number field can't be empty`);
      return;
    }
    const verifiedName = persons.find((x) => x.name === newName.name);
    if (verifiedName) {
      if (
        window.confirm(
          `${newName.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const newPerson = {
          name: newName.name,
          number: newName.number,
          // id: persons.length + 1, // server put auto id
        };

        //  http update request
        personService
          .update(verifiedName.id, newPerson)
          .then((resPerson) =>
            setPersons(
              persons.map((p) => (p.id !== verifiedName.id ? p : resPerson))
            )
          )
          .catch((error) => {
            setMessage({
              msg: `Person '${newName.name}' was already removed from server`,
              hasError: true,
            });
            setTimeout(() => {
              setMessage(null);
            }, 5000);
            setPersons(persons.filter((n) => n.id !== verifiedName.id));
          });
        return;
      } else return;
    }

    //  http post request
    const newPerson = {
      name: newName.name,
      number: newName.number,
      // id: persons.length + 1,
    };
    personService
      .create(newPerson)
      .then((resPerson) => setPersons(persons.concat(resPerson)))
      .then((any) => {
        setMessage({
          msg: `Added ${newName.name}`,
          hasError: false,
        });
        setTimeout(() => setMessage(null), 5000);
      });
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

  const handleDelete = async (id) => {
    // http delete request
    setPersons(persons.filter((n) => n.id !== id));
    await personService.deletePerson(id);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />

      <Filter handleSearch={handleSearch} search={search} />

      <h3>Add a new</h3>

      <PersonForm
        submit={submit}
        handleChange={handleChange}
        newName={newName}
      />

      <h3>Numbers</h3>

      <Persons
        persons={search === "" ? persons : personsFilter}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default App;
