import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    const [user, setUser] = useState(null)
    const [userId, setUserId] = useState('');

    const getUser = async (id) => {
        const user = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then(response => response.json())
        setUser(user);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!userId) return alert('Enter an id!');
        getUser(userId);
    }

    const handleChange = (e) => {
        const id = parseInt(e.target.value);
        if (isNaN(id)) setUserId('');
        if (id < 11 && id > 0) setUserId(id);
    }

    useEffect(() => {
        getUser(1);
    }, [])

    const userCard = () => {
        return (
            <>
                <h1>{user.name}</h1>
                <h2>{user.email}</h2>
                <p>{user.username}</p>
            </>
        );
    }
    return (
        <div className="App">
            <h1>React Testing Example</h1>
            {
                user
                    ? userCard()
                    : <h1>Enter an id</h1>
            }
            <form onSubmit={handleSubmit} >
                <label htmlFor='user-id'>User Id</label>
                <input id='user-id' value={userId} onChange={handleChange}></input>
                <button>Submit</button>
            </form>
        </div>
    );
}

export default App;
