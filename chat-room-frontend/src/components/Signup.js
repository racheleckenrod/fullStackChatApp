import React, { useState } from 'react';

const SignupForm = ({onSignup}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, email, password}),
            });

            if (response.status === 200) {
                const data = await response.json();

                onSignup(data.token, data.username);
            } else if (response.status === 409) {
                setError('Username already in use. Please choose a different username.')
            } else {
                setError('An error occurred. Please try again.')
            }
        } catch (error) {
            setError('An error occurred.')
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
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />

                <input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />

                

                <button type='submit'>Sign Up</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default SignupForm;