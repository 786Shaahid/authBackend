import env from "./environment.config.js";
export const chatConnection=(io,server)=>{
  const port =process.env.SOCKET_PORT;
    io.on('connection', (socket) => {
      socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
      });

      socket.on("sendMessage",({roomId,userId,message})=>{
        io.to(roomId).emit("chat",{ message,userId} )
      });

      socket.on('disconnect',()=>{
        console.log("User disconnect",socket.id);
       })
      });

      // Socket_server listening 
     server.listen(port,()=>{
       console.log(`Socket server is listening on port: ${port}`);
     })
      
}




