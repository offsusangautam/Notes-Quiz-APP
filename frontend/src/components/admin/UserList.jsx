import { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/users', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setUsers(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">All Users</h2>
      <ul>
        {users.map(user => (
          <li key={user._id} className="border p-2 my-2 rounded">
            {user.name} ({user.email}) - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
