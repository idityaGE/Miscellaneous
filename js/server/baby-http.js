import { createServer } from "net"

const reponse = `HTTP/1.0 200 OK\r\nContent-Type: text/html; charset=utf-8\r\n\r\n<h1>Hi! 👋</h1><p>I'm a web page.</p>`

createServer(async (socket) => {
  socket.end(reponse)
}).listen(8080)
