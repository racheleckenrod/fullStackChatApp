import React, { useState } from 'react';

const LoginForm = ({onLogin}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });

            if (response.status === 200) {
                const data = await response.json();
                onLogin(data.token, data.username);
            } else {
                setError('Invalid username or password. Please try again.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.')
        }
       
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                type='text'
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />

                <input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />

                <button type='submit'>Login</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default LoginForm;