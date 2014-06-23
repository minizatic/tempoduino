var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    httpport = 8080;

var sp = require("serialport");

var SerialPort = sp.SerialPort;
var port = new SerialPort("/dev/ttyUSB1", {
  baudrate: 9600,
  parser: sp.parsers.readline("\n")
});

port.open(function () {
  io.on('connection', function (socket) {
      port.on('data', function(data) {
        socket.emit("data", {temp: data});
      });
  });
});
 
var app = http.createServer(function(request, response) {
 
  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), "/public", uri);
  
  path.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }
 
    if (fs.statSync(filename).isDirectory()) filename += '/index.html';
 
    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }
 
      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(httpport, 10));

var io = require('socket.io')(app);
 
console.log("Static file server running at\n  => http://localhost:" + httpport + "/\nCTRL + C to shutdown");