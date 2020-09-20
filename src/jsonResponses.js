//The user list object
const users = {

};

//Respond to a request with a JSON object as the content.
const respondJSON = (request, response, status, json) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(json));
  response.end();
};

//Respond the HEAD requests with only a Head response
const respondMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.end();
};

//Return the list of users to the request
const getUserData = (request, response) => {
    respondJSON(request, response, 200, users);
};

//Return the meta data of a get users HEAD request
const getUserMetaData = (request, response) => respondMeta(request, response, 200);

//Add a new user to the users object or updata an existing user. If the incoming parameters
//are missing an age or name, return a 400 status and body. Else, create a new user or updata an
//existing one.
const addUser = (request, response, user) => {
  // if users[the name] exists, just update age and send back 204 with no message body
  // else try to create a new user. if there arent both parameters, send back 400, else
  // create new user

    const responseJSON = {
        message: 'Name and Age are both required parameters!',
    };

    if(!user.name || !user.age){
        responseJSON.id = 'missingParameters';
        return respondJSON(request, response, 400, responseJSON);
    }

    let responseCode = 201;

    if(users[user.name]){
        responseCode = 204;
        users[user.name].age = user.age;
    }
    else{
        users[user.name] = {};
        users[user.name].name = user.name;
        users[user.name].age = user.age; 
    }

    if(responseCode === 201){
        responseJSON.message = 'Successfully Created New User.';
        return respondJSON(request, response, responseCode, responseJSON);
    }

    return respondMeta(request, response, responseCode);

};

//Respond to a request for a page that doesn't exist with a JSON response object.
const notFound = (request, response) => {
  const responseJSON = {
    id: 'notFound',
    message: 'The page requested was not found.',
  };

  return respondJSON(request, response, 404, responseJSON);
};

//Respond to a HEAD request for a file that doesm't exist.
const notFoundMeta = (request, response) => respondMeta(request, response, 404);

module.exports = {
  getUserData,
  getUserMetaData,
  notFound,
  notFoundMeta,
  addUser,
};
