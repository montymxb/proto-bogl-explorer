const http  = require('http');
const fs    = require('fs');
const open  = require('open');
const httpProxy = require('http-proxy');

/**
 * Development server for local testing
 * NOT suitable for production
 */

const proxy = httpProxy.createProxyServer({
   host: 'http://localhost',
   port: 8181
});

const server = http.createServer((req, res) => {

  const send404 = (response) => {
    response.statusCode = 404;
    response.statusMessage = "Not found.";
    response.write("<!DOCTYPE html><html lang='en'><head><title>404 Not Found</title><meta charset='utf-8'></head><body><h1>404 Not Found.</h1></body></html>","text/html");
    response.end()
  }

  // get extension from request, and just send it back
  let url = (req.url != "" && req.url != "/") ? req.url : "index.html";
  let spt = url.split(".");
  let ext = spt[spt.length - 1];
  let contentType = 'text/'+ext;

  if(url == "/api") {
    // proxy all api requests to the backend server (should be running)
    console.log("- proxied to backend...");
    proxy.web(req, res, {
        target: 'http://localhost:8181'
    });
    return;

  }

  // verify the url is valid
  if(url.match(/~|(?:\.\.)/)) {
    console.log("- invalid query: " + url);
    // don't allow these characters to escape the web dir, crudely respond with a 404
    send404(res);
    return;

  }

  // verify this exists, and proceed accordingly
  let exists = fs.existsSync('site/' + url);

  if(exists) {
    let code = 200;
    // report what was requested
    console.info(code+": - " + url + " ("+contentType+")");
    // super crude response, but it works 'okay'
    res.writeHead(code, { 'Content-Type': contentType });
    fs.createReadStream('site/' + url).pipe(res);

  } else {
    let code = 404;
    console.info(code+": - " + url + " not found...");
    send404(res);
  }
})

server.listen(process.env.PORT || 3000);
open("http://localhost:3000");
