import { io } from "socket.io-client";

export const createSocketConnection = ()=>{
    if(location.hostname === "localhost"){
        return io('http://localhost:5000')
    }
    else{
        return io("/", {path: "/socket.io"})
    }
}