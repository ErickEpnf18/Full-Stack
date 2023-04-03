import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  const promise = axios.get(baseUrl);
  return promise.then(({ data }) => data);
};

const create = (newObject) => {
  const promise = axios.post(baseUrl, newObject);
  return promise.then(({ data }) => data);
};

const update = (id, newObject) => {
  const promise = axios.put(`${baseUrl}/${id}`, newObject);
  return promise.then(({ data }) => data);
};

const deletePerson = (id) => {
    const promise = axios.delete(`${baseUrl}/${id}`);
    return promise.then(({ data }) => data);
  };

export default {
  getAll,
  create,
    update,
    deletePerson
};
