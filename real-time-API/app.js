const express = require('express')
const http = require("http")
const {Server} = require("socket.io")
const app =  express()
const httpServer  = http.createServer(app)
const io = new Server(
    httpServer, {
        cors:{origin:"*"}
    }
)
require("dotenv").config()

io.on("connection", (socket) =>{
    console.log(`Client connected:${socket.id}`)

    
    socket.on("disconnect", (reason)=>{
        console.log(`client disconnected:${socket.id} (${reason})`)
    })

})

httpServer.listen(process.env.PORT, ()=>{

    console.log(`Server running on http://localhost:${process.env.PORT}`)

})
