// trackingSocket.js
let activeDrivers = {}; // store driver {plate: {lat, lng}}
let activeUsers = {};   // 🆕 new — stores active user locations

function initTrackingSocket(io) {
  io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);

    // 🟢 When driver sends location
    socket.on("driverLocation", (data) => {
      if (!data || !data.plate) return;

      activeDrivers[data.plate] = {
        lat: data.lat,
        lng: data.lng,
        socketId: socket.id,
      };

      console.log(`Location update from ${data.plate}:`, data);

      // Broadcast all active drivers to every connected client
      io.emit("driversUpdate", activeDrivers);
    });
    
    // 🆕 USER location sharing start
    socket.on("userLocation", (data) => {
      activeUsers[socket.id] = { lat: data.lat, lng: data.lng }; // 🆕 store user's live position
      io.emit("usersUpdate", activeUsers); // 🆕 broadcast all active users to everyone
    });

    // 🆕 USER stops sharing their location
    socket.on("stopUserLocation", () => {
      delete activeUsers[socket.id]; // 🆕 remove from active list
      io.emit("usersUpdate", activeUsers); // 🆕 notify clients to remove their marker
    });

    //  When driver disconnects
    socket.on("disconnect", () => {
      console.log("❌ Driver disconnected:", socket.id);

      //  On disconnect (driver or user leaves)
      for (let plate in activeDrivers) {
        if (activeDrivers[plate].socketId === socket.id) {
          console.log(`Removing ${plate} from activeDrivers`);
          delete activeDrivers[plate];
          break;
        }
      }
      // 🆕 remove disconnected user
      delete activeUsers[socket.id];

      // 🆕 broadcast updated lists to everyone
      io.emit("driversUpdate", activeDrivers);
      io.emit("usersUpdate", activeUsers);
    });
  });
}

module.exports = initTrackingSocket;
