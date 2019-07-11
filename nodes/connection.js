const axios = require('axios');
const https = require('https');

module.exports = function(RED) {
    "use strict";

    /*Connection Node functionality*/
    function OrchestratorConnectionNode(config) {
        RED.nodes.createNode(this,config);

        //////////////////////////////
        /*PROPERTIES*/
        //////////////////////////////

        this.account = config.account;
        this.tenant = config.tenant || 'default';
        this.user = config.user;
        this.token = null;
        this.expiration = Date.now();
        this.spec = {
                        withCredentials: true,
                        baseURL: (config.url).replace(/\/$/, ""),
                        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (this.token || '')}
                    };
        this.standardError = `Orchestrator: Could not connect to ${this.tenant} at ${this.url || 'platform.uipath.com'}. Please check your credentials.`;


        //////////////////////////////
        /*FUNCTIONS*/
        //////////////////////////////

        this.getToken = async function() {
            this.token = await (policy == 0 ? basicAuth() : oAuth());
            this.spec['headers'] = {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token};

            console.log("Refreshed Orchestrator Access Token");
        }

        this.basicAuth = async function() {
            // Set up basic endpoint
            let body = { method: 'post',
                         url: '/api/account/authenticate',
                         data: { tenancyName: this.tenant, 
                                 usernameOrEmailAddress: this.user, 
                                 password: this.credentials.password }
            };
            
            // Call
            var res = await axios({...body, ...this.spec});

            // Set expiration time
            this.expiration = Date.now() + 1500000;

            // Return token
            return res['data']['result'];
        }

        this.oAuth = async function() {
            // Set up standard OAuth endpoint
            let body = { method: 'post', 
                         url: 'https://account.uipath.com/oauth/token',
                         client_id: '5v7PmPJL6FOGu6RB8I1Y4adLBhIwovQN',
                         headers: {'Content-Type': 'application/json' }};

            // Choose whether to refresh access token or generate it for the first time
            body[data] = !!this.config.refresh
                         ? { grant_type: 'refresh_token', 
                             refresh_token: this.config.refresh }

                         : { grant_type: 'authorization_code', 
                             code: this.config.authcode,
                             code_verifier: this.config.verifier, 
                             redirect_uri: 'https://account.uipath.com/mobile' };
        
            // Call
            var res = await axios(body);
            
            // Save refresh token and expiration time
            this.config.refresh = res['data']['result']['refresh_token'];
            this.expiration = Date.now() + res['data']['result']['expires_in'] * 1000;
            
            // Return access token
            return res['data']['result']['access_token'];
        }


        this.request = async function(p) {
            // Refresh token if needed
            try {
                if (this.expiration <= Date.now()) 
                    await this.getToken();
            } catch (e) { throw new Error(this.standardError); };

            // Call
            if (p.headers) this.spec.headers = {...p.headers, ...this.spec.headers};
            var res = await axios({...p, ...this.spec});

            // Sanitize & Return
            ['request','config','headers'].forEach(k => {delete res[k]});
            return res;
        }


        //////////////////////////////
        /*ACTIONS*/
        //////////////////////////////

        if (config.ssl) this.spec['httpsAgent'] = new https.Agent({ rejectUnauthorized: false });   // Self-signed certs

        //this.getToken()
            //.catch( () => { this.error(this.standardError); });
    }
    

    /*Store credentials*/
    RED.nodes.registerType("orchestrator connection",OrchestratorConnectionNode, {
    	credentials: {
            password: {type:"password"},
            authcode: {type:"password"},
            verifier: {type:"password"},
            refresh: {type: "password"}
        }
    });
}