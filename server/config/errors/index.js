class ParamsError extends Error{
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = 400;
    this.isCB   = true;
  }
}

class AuthError extends Error{
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = 401;
    this.isCB   = true;
  }
}

class ScanError extends Error{
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = 402;
    this.isCB   = true;
  }
}


module.exports = {
  ParamsError,
  AuthError,
  ScanError
}
