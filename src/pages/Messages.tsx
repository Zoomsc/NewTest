import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import MessageThread from '../components/MessageThread';
import type { Message } from '../types';

export default function Messages() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const messagesQuery = query(
      collection(db, 'messages'),
      where('receiverId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(newMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSendMessage = async (content: string) => {
    if (!currentUser) return;

    const newMessage = {
      senderId: currentUser.uid,
      receiverId: 'admin',
      content,
      read: false,
      createdAt: new Date().toISOString()
    };

    await addDoc(collection(db, 'messages'), newMessage);
  };

  if (loading) {
    return <div className="text-center">Loading messages...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)]">
      <MessageThread
        messages={messages}
        currentUserId={currentUser?.uid || ''}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}