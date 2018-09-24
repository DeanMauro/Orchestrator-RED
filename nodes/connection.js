const axios = require('axios');
const https = require('https');

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
            
            var res = await axios({...body, ...this.spec});
            this.token = res['data']['result'];
            this.spec['headers'] = {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token};

            console.log("Refreshed Token");
        }


        this.request = async function(p) {
            // Refresh token if needed
            try {
                if (!this.start || (Date.now() - this.start) >= 1500000)
                    await this.getToken();

                return axios({...p, ...this.spec});
            } catch (e) { throw new Error(`Orchestrator: Could not connect to ${this.tenant}/${this.user}. Please check your credentials.`); };
        }


        // this.requests = function(calls) {
        //     return axios.all(calls.map(c => this.request(c)));
        // }

        //////////////////////////////
        /*ACTIONS*/
        //////////////////////////////
        if (config.ssl) this.spec['httpsAgent'] = new https.Agent({ rejectUnauthorized: false });   // Self-signed certs

        this.getToken()
            .then( () => { this.start = Date.now(); })
            .catch( () => { this.error(`Orchestrator: Could not connect to ${this.tenant}/${this.user}. Please check your credentials.`); });
    }
    

    /*Store credentials*/
    RED.nodes.registerType("orchestrator connection",OrchestratorConnectionNode, {
    	credentials: {
            password: {type:"password"}
        }
    });


}