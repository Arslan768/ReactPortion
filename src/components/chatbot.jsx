import React, { useState } from 'react';

export const Chatbot = ({ onResponse }) => {
  const [messages, setMessages] = useState([]); // Stores conversation
  const [input, setInput] = useState('');       // Stores user input
  const [loading, setLoading] = useState(false); // Indicates when the bot is processing

  const handleSendMessage = async () => {
    if (input.trim()) {
      // Add user message to the conversation
      setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: input }]);

      // Send the user's question to the backend API
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: input }), // Send the input to the backend
        });
        const data = await response.json();
        if (response.ok) {
          // Add the processed response to the conversation
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'bot', text: data.response },
          ]);
          onResponse(data.response); // Call the onResponse prop with the response
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'bot', text: 'Sorry, I did not understand your question.' },
          ]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: 'There was an error processing your question.' },
        ]);
      }
      setLoading(false);
      setInput(''); // Clear the input field
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value); // Update input as user types
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage(); // Send message on pressing Enter
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatWindow}>
        {messages.map((message, index) => (
          <div key={index} style={message.sender === 'user' ? styles.userMessage : styles.botMessage}>
            {message.text}
          </div>
        ))}
      </div>
      {loading && <div style={styles.loading}>Bot is processing...</div>}
      <input
        type="text"
        style={styles.input}
        value={input}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
      />
      <button style={styles.sendButton} onClick={handleSendMessage}>
        Send
      </button>
    </div>
  );
};

// Basic styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f0f0f0', // Add a background color here
    border: '1px solid #ccc',
    borderRadius: '10px', // Rounded corners for a smoother look
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Add shadow for depth
    width: '400px',
    margin: '20px auto',
  },
  chatWindow: {
    width: '100%',
    height: '300px',
    overflowY: 'auto',
    border: '1px solid #ddd',
    borderRadius: '8px', // Rounded corners for the chat window
    padding: '10px',
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff', // Background color for the chat window
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1e7dd',
    padding: '8px',
    borderRadius: '8px',
    marginBottom: '5px',
    maxWidth: '70%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f8d7da',
    padding: '8px',
    borderRadius: '8px',
    marginBottom: '5px',
    maxWidth: '70%',
  },
  loading: {
    color: '#888',
    fontStyle: 'italic',
  },
  input: {
    width: '80%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginRight: '10px',
  },
  sendButton: {
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
};