'use strict';

module.exports = function Client (socket, handle) {
  this.socket = socket;
  this.handle = handle || `n00b_${Math.floor(Math.random() * 1337)}`;
}
