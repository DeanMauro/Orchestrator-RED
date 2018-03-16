"use strict";
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

class Orchestrator {
  
  constructor(tenant, user, pass, url) {
    this.url = url || 'https://platform.uipath.com/';
    this.token = null;
    this.token = this.getToken(tenant, user, pass);
    this.start = Date.now();
  }


  getToken(tenant, user, pass) {
  	let body = JSON.stringify({tenancyName: tenant, usernameOrEmailAddress: user, password: pass});
  	return this.request({ type: "POST", 
  						  extension: 'api/account/authenticate', 
  						  body: body });
  }


  request(p) {
  	var xhttp = new XMLHttpRequest();
  	xhttp.withCredentials = true;

  	// All but authentication is asynchronous. Use a callback to get the response
  	if (!!this.token) {
	  	xhttp.onreadystatechange = function() {
	        if (this.readyState == this.DONE) {
	        	let result = JSON.parse(this.responseText || "{\"status\":"+this.status+"}");
	        	p["callback"](result, this.status);
			    }
	    };
	  }

	// Compose request
    xhttp.open(p["type"].toUpperCase(), this.url + p["extension"], !!this.token);
    xhttp.setRequestHeader('Content-Type', 'application/json');
  	xhttp.setRequestHeader('Authorization', 'Bearer ' + (this.token || ''));
    xhttp.send(p["body"]);
    
    // Authentication is synchronous, so just return the token.
    if (!this.token) {
    	let arr = JSON.parse(xhttp.responseText);
    	return arr["result"]
    }
  }


  refreshToken(node) {
    if (!this.start || (Date.now() - this.start) >= 1500000)
      Orchestrator.refresh(node);
  }


  static refresh(node) {
    var creds = node.credentials;
    var orch = new Orchestrator(creds.tenant, 
                                creds.username, 
                                creds.password,
                                creds.url);
    
    node.context().flow.set("orch", orch);
    console.log("Refreshed Token");
  }

}

global.Orchestrator = Orchestrator;