const { log } = require('console')
const express = require('express')
const app = express()
const http = require('http')

const server = http.createServer(app)
const socketIo = require('socket.io')
const io = socketIo(server)

app.set("view engine","ejs")

const usernames = []
const userIds = []

io.on("connection",function(socket){
    socket.on("userConnected",function(name){
        usernames.push(name)
        userIds.push(socket.id)    
        
        io.emit("onlineusers", usernames)
    })


    socket.on("message",function(message){
        let index = userIds.indexOf(socket.id)
        let username = usernames[index]
        let id= socket.id

        io.emit("message",{message,id,username})
    })

    socket.on("disconnect",function(){
        let index = userIds.indexOf(socket.id)
        usernames.splice(index,1);
        userIds.splice(index,1);

        io.emit("onlineusers", usernames)
    })

    socket.on("input",function(value){
        let index = userIds.indexOf(socket.id)
        let username = usernames[index]
        socket.broadcast.emit("input",username)  
    })
   
})


app.get("/",function(req,res){
    res.render("index")
})

server.listen(3000)