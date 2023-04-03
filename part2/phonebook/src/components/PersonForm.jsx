
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

export default PersonForm
