const express = require('express');
const app = express();


const cors = require("cors");//cross origin resource sharing
//app.use(cors());
// ✅ Allow frontend origin
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST","PUT"],
  credentials: true
}));
app.use(express.json());

require('dotenv').config();     
const {jwtAuthMiddleware,generateToken} = require('./jwt.js');

const bodyParser=require('body-parser');
app.use(bodyParser.json()) /*It lets Express read JSON data from requests —body-parser parses incoming JSON so you can access it with req.body.*/

const db=require('./db');
const users=require('../backend/models/users');


app.get('/',(req,res)=>{
    res.send("hello !!!, where is my buggy");
});

//routes
const userRoutes = require('./routes/userRoutes.js');
const driverRoutes = require('./routes/driverRoutes.js');

app.use('/user',userRoutes);
app.use('/driver',driverRoutes);

//update password for person
app.put('/changepassword/:id', jwtAuthMiddleware ,async (req, res) => {
    try {
        const personId = req.params.id.trim(); // Remove whitespace/newlines
        const { password } = req.body;//this is new passwrod
        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }

        // Use the static method to update and hash the password
        const updatedPerson = await users.updatePasswordById(personId, password);

        res.status(200).json(updatedPerson);
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
///////////////////////////////////////////////////////////////////////////////////////////////
//SOCKET.IO Server
const http = require("http");// Create raw HTTP server to attach socket.io
const { Server } = require("socket.io"); //for creating server instance
const initTrackingSocket = require("./socketserver/trackingSocket.js");

//  Express by default can’t handle real-time connections (only HTTP)
//    So we wrap it in a real HTTP server for WebSocket communication
const server = http.createServer(app);



// Create socket.io instance
const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000", // your React app URL
        methods: ["GET", "POST","PUT"],
        credentials: true
    },
})

// initialize your custom socket file
initTrackingSocket(io);

//Start the combined HTTP + WebSocket server
const PORT = process.env.PORT || 5001;
server.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}........`);
})
/*app.listen(5001,()=>{
    console.log("server is running on PORT 5001........");
});*/

