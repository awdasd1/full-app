import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchMessages();
    checkUser();

    const subscription = supabase
      .from('messages')
      .on('INSERT', (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  async function fetchMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
    }
  }

  async function sendMessage() {
    if (newMessage.trim() === '' || !user) return;

    const { error } = await supabase
      .from('messages')
      .insert([{ user_id: user.id, content: newMessage }]);
    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const { data, error } = await supabase.storage
      .from('chat-files')
      .upload(`${user.id}/${file.name}`, file);

    if (error) {
      console.error('Error uploading file:', error);
    } else {
      const fileUrl = supabase.storage.from('chat-files').getPublicUrl(data.path).data.publicUrl;
      const { error: messageError } = await supabase
        .from('messages')
        .insert([{ user_id: user.id, content: `[File] ${file.name}`, file_url: fileUrl }]);

      if (messageError) {
        console.error('Error sending file message:', messageError);
      }
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Chat Login</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please log in to use the chat.</p>
            {/* Add login form here */}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col h-screen p-4">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto flex flex-col gap-2">
          {messages.map((message) => (
            <div key={message.id} className="p-2 border rounded-md">
              <strong>{message.user_id}:</strong> {message.content}
            </div>
          ))}
        </CardContent>
        <div className="p-4 border-t flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
          />
          <Button onClick={sendMessage}>Send</Button>
          <Input type="file" onChange={handleFileUpload} />
        </div>
      </Card>
    </div>
  );
}

export default ChatPage;
