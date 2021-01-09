import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from 'firebase';
import { db } from './firebase';

function App() {
  const [input, setInput] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    //realtime listener that will map our posts from firebase
    db.collection('posts').onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
      console.log(posts);
    });
  }, []);

  const sendPost = (e) => {
    e.preventDefault();

    db.collection('posts').add({
      name: 'Any Name',
      description: 'this is a test',
      message: input,
      photoURL: '',
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  };

  const deletePost = (id) => {
    db.collection('posts').doc(id).delete();
  };

  return (
    <div className="App">
      <form>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
        />
        <button onClick={sendPost} type="submit">
          Send
        </button>
      </form>

      {posts.map(({ id, data: { name, description, message, photoURL } }) => {
        return (
          <div key={id}>
            <h1>{name}</h1>
            <p>{description}</p>
            <p>{message}</p>
            <button onClick={() => deletePost(id)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
