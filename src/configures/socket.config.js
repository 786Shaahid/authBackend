import env from "../utility/environment.utility.js";
export const chatConnection=(io,server)=>{
  const port =process.env.SOCKET_PORT;
    io.on('connection', (socket) => {
      // console.log("user connected ",socket.id);
      socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
      });

      socket.on("sendMessage",({roomId,userId,message})=>{
        // console.log("room Id",roomId);
        // console.log("message ",userId,message);
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




