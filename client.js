const net = require("node:net")
const fs = require("node:fs/promises")
const path = require("node:path")

const Host = "::1" //LocalHost Ipv6
const Port = 5050

const arguments = process.argv

const removePrevLine = (cb) => {
    process.stdout.moveCursor(0,-1,()=>{
        process.stdout.clearLine(0,cb)
    })
}

const socket = net.createConnection({host:Host,port:Port},async ()=>{
    
    const filePath = arguments[2]
    if(!filePath){
        socket.end()
        console.log("Error: You did not specified the filePath!")
        return console.log("Run: node client.js <filePath(absolute/relative)>")
    }
    const fileHandle = await fs.open(filePath,"r")
    const readStream = fileHandle.createReadStream()

    //Adding a simple Progress UI
    const fileSize = (await fileHandle.stat()).size
    let uploadPercentage = 0
    let bytesUploaded = 0

    const filename = path.basename(filePath)
    socket.write(filename)
    readStream.on("data",(chunk)=>{
        socket.write(chunk)
        bytesUploaded += chunk.length
        const addedPercentage = Math.floor((bytesUploaded/fileSize) * 100)
        if(addedPercentage!== uploadPercentage){
        uploadPercentage = addedPercentage
        removePrevLine(()=>console.log(`Uploading.....${uploadPercentage}%`))
        }
    })

    readStream.on("end",()=>{
        fileHandle.close()
        socket.end()
        console.log("Finished Uploading!")
    })
})