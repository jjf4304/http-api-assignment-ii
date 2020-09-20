const http = require('http');
const url = require('url');
const query = require('querystring');
const pageResponseHandler = require('./pageResponses.js');
const jsonResponseHandler = require('./jsonResponses.js');
const { parse } = require('path');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': pageResponseHandler.getIndex,
    '/index.html': pageResponseHandler.getIndex,
    '/style.css': pageResponseHandler.getStyle,
    '/getUsers': jsonResponseHandler.getUserData,
    notFound: jsonResponseHandler.notFound,
  },
  HEAD: {
    '/getUsers': jsonResponseHandler.getUserMetaData,
    notFound: jsonResponseHandler.notFoundMeta,
  },

};

//Handle incoming GET requests. Serve the relevant url function.
const handleGET = (request, response, parsedUrl) =>{
    if (urlStruct[request.method][parsedUrl.pathname]) {
        urlStruct[request.method][parsedUrl.pathname](request, response);
    } else {
    urlStruct[request.method].notFound(request, response);
    }
};

//Handle incoming POST requests. Chunk the incoming data for the
//params and then bring them together into a usable string. Then
//call the addUser function in jsonResponses.js with that data to
//add a user.
const handlePOST = (request, response, parsedUrl) =>{
    if(parsedUrl.pathname === '/addUser'){
        const body = [];

        request.on('error', (err)=>{
            console.dir(err);
            response.statusCode = 400;
            response.end();
        });

        request.on('data', (chunk)=>{
            body.push(chunk);
        });

        request.on('end', ()=>{
            const bodyString = Buffer.concat(body).toString();
            const userParams = query.parse(bodyString);

            jsonResponseHandler.addUser(request, response, userParams);
        });
    }
}

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  console.dir(parsedUrl.pathname);
  console.dir(request.method);

  //If the request was a GET or HEAD request, handle it from URL struct
  //Else handle with POST request to addUser
    if(request.method === 'GET' || request.method ==='HEAD')
        handleGET(request, response, parsedUrl);

    else
        handlePOST(request, response, parsedUrl);

};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
