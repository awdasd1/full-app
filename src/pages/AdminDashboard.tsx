import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    // NOTE: Fetching all users directly from Supabase auth is not possible
    // with the client-side library for security reasons.
    // A server-side function or a dedicated admin API route would be needed
    // to list all users. For this example, we'll simulate fetching users
    // or fetch from a custom 'profiles' table if you have one.
    // Assuming a 'profiles' table linked to auth.users:
    const { data, error } = await supabase
      .from('profiles') // Replace 'profiles' with your actual user data table
      .select('id, email'); // Select relevant fields

    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data || []);
    }
  }

  async function createUser() {
    if (newUserEmail.trim() === '' || newUserPassword.trim() === '') return;

    const { data, error } = await supabase.auth.signUp({
      email: newUserEmail,
      password: newUserPassword,
      options: {
        emailRedirectTo: window.location.origin, // Or a specific confirmation page
      },
    });

    if (error) {
      console.error('Error creating user:', error);
    } else {
      console.log('User created:', data);
      setNewUserEmail('');
      setNewUserPassword('');
      fetchUsers(); // Refresh user list
    }
  }

  // Function to generate and assign a token (example - requires server-side logic)
  async function generateToken(userId: string) {
    console.log(`Generating token for user: ${userId}`);
    // This would typically involve a server-side function call
    // to generate a JWT or a custom token and store it.
    alert(`Simulating token generation for user ${userId}. This requires server-side implementation.`);
  }

  return (
    <div className="container mx-auto flex flex-col min-h-screen p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Create New User</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
              />
              <Button onClick={createUser}>Create User</Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Existing Users</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => generateToken(user.id)}>Generate Token</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
