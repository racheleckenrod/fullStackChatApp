import React from "react";

const MessageList = ({messages}) => {

    return (
        <div>
            <h2>Messages</h2>
            <ul>
                {messages.map((message,index) => (
                    <li key={index}>
                        <span className='timestamp'>
                            {new Date(message.timestamp).toLocaleString()}
                        </span>
                        <span>
                            {message.user ? message.user.username : 'Anonymous'}- {""}
                        </span>
                        <span>
                            {message.content}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MessageList;