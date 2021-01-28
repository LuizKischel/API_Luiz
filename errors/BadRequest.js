function BadRequestException(message) {
    const error = new Error(message);
  
    error.code = "400";
    error.sender = "BadRequest"
    return error;
  }
  
  BadRequestException.prototype = Object.create(Error.prototype);
  module.exports = BadRequestException