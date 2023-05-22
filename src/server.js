const net = require("node:net");
const fs = require("node:fs/promises");


const Host = "::1"; // LocalHost Ipv6
const Port = 5050;

const server = net.createServer();

server.on("connection", async (socket) => {
  console.log("Socket Connected");
  let filename,filehandle,ws;
  socket.on("data", async (chunk) => {
    const stringData = chunk.toString("utf-8");
    if (!filehandle) {
      socket.pause()
      filename = stringData.substring(15)
      filehandle = await fs.open(`${__dirname}/storage/${filename}`,"w")
      ws = filehandle.createWriteStream() 
      socket.resume()
    } else {
        ws.write(chunk)
    }
  });
  socket.on("end", async () => {
    if (ws) {
      ws.end()
      console.log("Closed the File and also emitted the socket closing event!");
    } else {
      console.log("Closed the socket without doing anything!");
    }
  });
});

server.on("error", (err) => {
  console.log(`Error: ${err}`); // Handling the error if something goes wrong!
});

server.listen(Port, Host, () => console.log(`server has started at ${Host} on port ${Port}.`));
