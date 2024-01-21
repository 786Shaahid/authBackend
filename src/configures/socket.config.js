// import { Socket } from "socket.io";
// import { io } from "../..";

export const chatConnection=(io)=>{
    io.on('connection', (socket) => {
        // console.log(`User connected: ${socket.id}`);
      
        // Handle private messages
        socket.on('privateMessage', ({  message }) => {
            // const recipientSocket = io.sockets.connected[recipientSocketId];
            console.log(message);
        //   if (recipientSocket) {
            // .emit('privateMessage', { senderSocketId: socket.id, message });
        //   }
        });
      
        // Handle user disconnect
        // socket.on('disconnect', () => {
        //   console.log(`User disconnected: ${socket.id}`);
        // });
      });
      
}




