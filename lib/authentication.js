"use strict";

const axios = require('axios');
const https = require('https');

class Authentication {
	
	constructor(config) {
		this.token = null;
		this.expiration = Date.now();
		this.spec = {
			headers: {'Content-Type': 'application/json', 'X-UIPATH-TenantName': config.tenant}
		};

		if (config.ssl) this.spec['httpsAgent'] = new https.Agent({ rejectUnauthorized: false });   // Self-signed certs
	}


	async getToken(config) {
		if (this.isExpired()) {
	        this.token = await (config.policy == 0 ? this.initOnPrem(config) 
	        								   	   : this.initCloud(config));

        	this.updateAuthHeader();

	        console.log(`Refreshed Orchestrator Access Token (${config.tenant})`);
	    }
    }


    async initOnPrem(config) {
        // Set up basic endpoint
        let body = { method: 'post',
                     url: (config.url).replace(/\/$/, "") + '/api/account/authenticate',
                     data: { tenancyName: config.tenant, 
                             usernameOrEmailAddress: config.user, 
                             password: config.password }
        };
        
        // Call
        var res = await this.call(body);

        // Set expiration time
        this.setExpiration(1500000);

        // Return token
        return res['data']['result'];
    }


    async initCloud(config) {
        // Set up cloud endpoint
        let body = { method: 'post',
                     url: 'https://account.uipath.com/oauth/token',
                     data: { grant_type: "refresh_token", 
                             client_id: config.clientId, 
                             refresh_token: config.userKey }
        };
        
        // Call
        var res = await this.call(body);

        // Set expiration time
        this.setExpiration(res['data']['expires_in'] * 1000);

        // Return token
        return res['data']['access_token'];
    }


    async call(body) {
    	return await axios({...body, ...this.spec});
    }


    setExpiration(offset) {
    	this.expiration = Date.now() + offset;
    }


    updateAuthHeader() {
    	this.spec.headers['Authorization'] = `Bearer ${this.token}`;
    }

    isExpired() {
        return this.expiration <= Date.now();
    }
}

module.exports = Authentication;