import net from "net"



const server = net.createServer((socket) =>  {
    socket.end(`${new Date()}\n`)
})

server.listen(6969)
