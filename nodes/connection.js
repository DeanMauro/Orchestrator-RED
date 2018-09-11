const axios = require('axios');

module.exports = function(RED) {
    "use strict"

    /*Connection Node functionality*/
    function OrchestratorConnectionNode(config) {
        RED.nodes.createNode(this,config);

        //////////////////////////////
        /*DECLARATIONS*/
        //////////////////////////////

        this.tenant = config.tenant || 'default';
        this.user = config.user;
        this.token = null;
        this.start = null;
        this.spec = {
                        withCredentials: true,
                        baseURL: (config.url || 'https://platform.uipath.com').replace(/\/$/, ""),
                        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (this.token || '')}
                    }


        this.getToken = async function() {
            let body = { method: 'post', 
                         url: '/api/account/authenticate',
                         data: { tenancyName: this.tenant, 
                                 usernameOrEmailAddress: this.user, 
                                 password: this.credentials.password }
            };
            
            try {
                var res = await axios({...body, ...this.spec});
                this.token = res['data']['result'];
                this.spec['headers'] = {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token};

                console.log("Refreshed Token");
            } catch(e) {
                return Promise.reject(new Error("Could not connect to Orchestrator. Please check your credentials."));
            }
        }


        this.request = async function(p) {
            // Refresh token if needed
            if (!this.start || (Date.now() - this.start) >= 1500000)
                this.getToken();

            return axios({...p, ...this.spec});
        }


        this.requests = function(...calls) {
            return axios.all(calls.map(c => this.request(c)));
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