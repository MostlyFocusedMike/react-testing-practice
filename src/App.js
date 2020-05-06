import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    const [user, setUser] = useState(null)
    const [userId, setUserId] = useState(1);

    const getUser = async (id) => {
        const user = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then(response => response.json())
        console.log('user:', user)
        setUser(user);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        getUser(userId);
    }

    const handleChange = (e) => {
        const id = e.target.value
        if (id < 11) setUserId(id);
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
                <input type='submit' value='Submit' />
            </form>
        </div>
    );
}

export default App;
