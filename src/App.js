import React, { useState, useEffect } from "react";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    occupation: "",
    idNumber: "",
    telephone: "",
  });

  const [persons, setPersons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(""); // State to hold error message

  const BACKEND_URL = "https://task-sever.onrender.com/api/persons";

  useEffect(() => {
    fetchPersons(); // reload app
  }, []);

  const fetchPersons = async () => {
    try {
      const response = await fetch(BACKEND_URL);
      const data = await response.json();
      setPersons(data);
    } catch (error) {
      console.error("Error fetching persons", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const validateForm = () => {
    const { name, occupation, idNumber, telephone } = formData;
    if (!name || !occupation || !idNumber || !telephone) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError("All fields are required."); // Set error message
      return;
    }
    setError(""); // Clear error message if validation passes
    try {
      await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      fetchPersons(); // Refresh the list after person creation

      setFormData({
        name: "",
        occupation: "",
        idNumber: "",
        telephone: "",
      });
    } catch (error) {
      console.error("Error saving person", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${BACKEND_URL}/${id}`, {
        method: "DELETE",
      });
      fetchPersons(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting person", error);
    }
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-row justify-around p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mb-8">
        {error && <div className="text-red-500 mb-4">{error}</div>}{" "}
        {/* Display error message */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700">Occupation:</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700">ID No:</label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700">Telephone:</label>
            <input
              type="text"
              name="telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md"
          >
            Save
          </button>
        </form>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <input
          type="text"
          placeholder="Search here"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full mb-4 p-2 border rounded-md"
        />
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Id</th>
              <th className="px-4 py-2">Contact</th>
              <th className="px-4 py-2">Occupation</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPersons.map((person, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{person.name}</td>
                <td className="px-4 py-2">{person.idNumber}</td>
                <td className="px-4 py-2">{person.telephone}</td>
                <td className="px-4 py-2">{person.occupation}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(person.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
