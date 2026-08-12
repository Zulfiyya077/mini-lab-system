import { Socket } from "node:dgram";
import { Server } from "socket.io";

let io: Server;


export const initSocket = (httpServer: any) => {
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    });
    io.on("connection", (socket) => {
        console.log("Socket connected: ", socket.id);

        socket.on("disconnec", () => {
            console.log("Socket disconnected:", socket.id)
        })
    })

    return io;

};



export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized")
    }

    return io;
}