var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = function(RED) {
    "use strict"

    /*Connection Node functionality*/
    function OrchestratorConnectionNode(config) {
        RED.nodes.createNode(this,config);

        //////////////////////////////
        /*DECLARATIONS*/
        //////////////////////////////

        this.url = (config.url || 'https://platform.uipath.com').replace(/\/$/, "");
        this.tenant = config.tenant || 'default';
        this.user = config.user;
        this.token = null;
        this.start = null;


        this.getToken = function() {
            // Add credentials to request body
            let body = JSON.stringify({tenancyName: this.tenant, usernameOrEmailAddress: this.user, password: this.credentials.password});
            
            // Compose request
            var xhttp = new XMLHttpRequest();
            xhttp.withCredentials = true;
            xhttp.open('POST', this.url + '/api/account/authenticate', false);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.send(body);

            // Authentication is synchronous. Return token
            try {
              let arr = JSON.parse(xhttp.responseText);
              this.token = arr["result"];
              console.log("Refreshed Token");
            } catch (e) {
              throw new Error("Could not connect to Orchestrator. Please check your credentials.");
            }
        }


        this.request = function(p) {
            // Refresh token if needed
            if (!this.start || (Date.now() - this.start) >= 1500000)
                this.getToken();

            var xhttp = new XMLHttpRequest();
            xhttp.withCredentials = true;

            // Use a callback to get the response
            xhttp.onreadystatechange = function() {
                if (this.readyState == this.DONE) {
                    let result = JSON.parse(this.responseText || "{\"status\":"+this.status+"}");
                    p["callback"](result, this.status);
                }
            };

            // Compose request
            xhttp.open(p["type"].toUpperCase(), this.url + '/' + p["extension"], true);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.setRequestHeader('Authorization', 'Bearer ' + (this.token || ''));
            xhttp.send(p["body"]);
        }

        //////////////////////////////
        /*ACTIONS*/
        //////////////////////////////
        this.getToken();
        this.start = Date.now();
    }
    

    /*Store credentials*/
    RED.nodes.registerType("orchestrator connection",OrchestratorConnectionNode, {
    	credentials: {
            password: {type:"password"}
        }
    });


}