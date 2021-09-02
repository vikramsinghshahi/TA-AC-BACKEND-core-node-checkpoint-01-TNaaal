var http =  require("http");

var fs = require("fs");

var server = http.createServer(handleServer);

function handleServer(req, res){
    if(req.method === "GET" && req.url === "/"){
        res.setHeader("content-type" ,"text/html")
        fs.createReadStream("./index.html").pipe(res);
    }
    if(req.method === "GET" && req.url === "/about"){
        res.setHeader("content-type" ,"text/html")
        fs.createReadStream("./about.html").pipe(res);
    }
}

server.listen(5000, ()=>{
    console.log("server is listening at 5k")
})