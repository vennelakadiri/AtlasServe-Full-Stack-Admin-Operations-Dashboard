import React, { useState, useEffect } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/users");
    const data = await res.json();
    setUsers(data);
  };

  const addUser = async () => {
    const res = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, role })
    });
    const data = await res.json();
    setUsers([...users, data]);
    setName(""); setEmail(""); setRole("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>AtlasServe Dashboard</h1>

      <div>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Role" value={role} onChange={e => setRole(e.target.value)} />
        <button onClick={addUser}>Add User</button>
      </div>

      <h2>Users</h2>
      <ul>
        {users.map(u => (
          <li key={u._id}>{u.name} - {u.email} - {u.role}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
