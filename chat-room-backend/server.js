require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const ChatRoom = require('./models/ChatRoom');
const Message = require('./models/Message');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const bcrypt = require('bcrypt');

const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
        origin: "*"
    },
});

app.use(express.json());
app.use(cors());

const mongoURI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.z2gedjc.mongodb.net/`;

mongoose.connect(mongoURI).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((error) => {
    console.log('MongoDB Atlas connection error:', error);
});

io.on('connection', (socket) => {
    console.log(`New client connected to websocket: ${socket.id}`);
    socket.on('joinRoom', async ({room}) => {
        socket.join(room);
        console.log(`${socket.id} joined ${room}`)

        const messages = await Message.find({room})
        .sort({timestamp: -1})
        .limit(15)
        .populate('user', 'username');

        socket.emit('previousMessages', messages);
    });

    socket.on('sendMessage', async ({room, message, userId}) => {
        const user = await User.findById(userId);

        if(!user) {
            return;
        }

        const newMessage = new Message({
            room,
            content: message,
            user: userId,
        });

        await newMessage.save();

        await newMessage.populate('user', 'username');

        io.to(room).emit('newMessage', newMessage);
        
    });

    socket.on('leaveRoom', ({room }) => {
        socket.leave(room);
        console.log(`user left room: ${room}`);
    });


    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

});

app.post('/register', async (req,res) => {
    const {username, email, password} = req.body;
    const exsistingUser = await User.findOne({ username });
    if (exsistingUser) {
        return res.status(409).json({ error: 'Username already in use.'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({username, email, password: hashedPassword});
    await user.save();
    const token = jwt.sign({userId: user._id}, 'your-secret-key');
    res.send({token, username});
})

app.post('/login', async (req,res) => {
    const {username, password} = req.body;
   
    const user = await User.findOne({username});
    if (!user) {
        return res.status(404).send('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).send('Invalid password');
    }
    const token = jwt.sign({userId: user._id}, 'your-secret-key');
    res.send({token, username});
});


server.listen(8000, () => {
    console.log('Server running on http://localhost:8000')
});

