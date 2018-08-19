"use strict";
var Signalr = require("signalr");

class Events {
  
  constructor(extension) {
    this.extension = extension;
  }

  connect() {
    const connection = new signalR.HubConnectionBuilder()
    .withUrl(this.extension)
    .build();

    connection.on("ReceiveMessage", (user, message) => {
        console.log(`Received a telegram from ${user}: ${message}`);
    });

    connection.start().catch(err => console.error(err.toString()));
  }

}

module.exports = Events;