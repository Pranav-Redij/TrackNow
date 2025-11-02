// trackingSocket.js
let activeDrivers = {}; // store driver {plate: {lat, lng}}

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

    // 🔴 When driver disconnects
    socket.on("disconnect", () => {
      console.log("❌ Driver disconnected:", socket.id);

      // remove driver from activeDrivers
      for (let plate in activeDrivers) {
        if (activeDrivers[plate].socketId === socket.id) {
          console.log(`Removing ${plate} from activeDrivers`);
          delete activeDrivers[plate];
          break;
        }
      }

      // update everyone
      io.emit("driversUpdate", activeDrivers);
    });
  });
}

module.exports = initTrackingSocket;
