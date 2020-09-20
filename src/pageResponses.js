const fs = require('fs');

// the client.html file
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
// the style.css file
const style = fs.readFileSync(`${__dirname}/../client/style.css`);

const respond = (request, response, status, content, contentType) => {
  response.writeHead(status, { 'Content-Type': contentType });
  response.write(content);
  response.end();
};

// Serve the index page
const getIndex = (request, response) => respond(request, response, 200, index, 'text/html');

// Serve the style.css page
const getStyle = (request, response) => respond(request, response, 200, style, 'text/css');

module.exports = {
  getIndex,
  getStyle,
};
