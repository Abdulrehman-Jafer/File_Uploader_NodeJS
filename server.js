const net = require("node:net")
const fs = require("node:fs/promises")

const Host = "::1" //LocalHost Ipv6
const Port = 5050

const server = net.createServer()


server.on("connection",async (socket)=>{
    console.log("Socket Connected")
    let i = 0,fileHandle,fileWriteStream
    socket.on("data",async (chunk)=>{
        if(i == 0){
             fileHandle = await fs.open(`./storage/${chunk.toString("utf-8")}`,"w")
             fileWriteStream = fileHandle.createWriteStream()   
             return ++i;
        }
        else{
            fileWriteStream.write(chunk)
            ++i;
        }
    })
    socket.on("end",()=>{
        socket.end()
        i=0
        if(fileHandle){
            fileHandle.close()
            console.log("Closed the File and also emitted the socket closing event!")
        }else{
            console.log("Closed the socket without doing anything!")
        }
    })
});

server.on("error",(err)=>{
    console.log(`Error: ${err}`) //Handling the error if something goes wrong!
})

server.listen(Port,Host,()=>console.log(`server has starte at ${Host} on port ${Port}.`)
)