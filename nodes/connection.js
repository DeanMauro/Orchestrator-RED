const axios = require('axios');
const Authentication = require('../lib/authentication.js');
const Api = require('../lib/api.js');

module.exports = function(RED) {
    "use strict";

    /*Connection Node functionality*/
    function OrchestratorConnectionNode(config) {
        RED.nodes.createNode(this,config);

        //////////////////////////////
        /*PROPERTIES*/
        //////////////////////////////
        this.tenant = config.tenant || 'default';
        this.baseUrl = (config.url).replace(/\/$/, "") || `https://platform.uipath.com/${config.account}/${config.tenant}`;
        this.folders = {};
        this.spec = {
                        withCredentials: true,
                        baseURL: this.baseUrl
                    };
        this.standardError = `Orchestrator: Could not connect to ${this.tenant} at ${this.baseUrl}. Please check your credentials.`;
        this.auth = new Authentication(config);

        //////////////////////////////
        /*FUNCTIONS*/
        //////////////////////////////

        this.request = async function(p) {
            // Refresh token if needed
            try {
                await this.auth.getToken({...config, ...this.credentials});
            } catch (e) { 
                throw new Error(this.standardError); 
            };

            // Combine call settings
            var settings = {...this.spec, ...this.auth.spec};
            if (p.headers) settings.headers = {...p.headers, ...settings.headers};

            // Call
            var res = await axios({...p, ...settings});

            // Sanitize & Return
            ['request','config','headers'].forEach(k => {delete res[k]});
            return res;
        }

        this.getFolderId = async function(folderName) {
            folderName = folderName || "Default";

            if (!this.folders[folderName] || this.auth.isExpired()) {
                var call = Api["Folders"]("GetAll");

                try {
                    var res = await this.request({ method: call[0], url: call[1] });

                    res['data']['value'].forEach(x => this.folders[x.FullyQualifiedName] = x.Id);
                } catch(e) {
                    throw `Could not find a folder named '${folderName}' in tenant '${tenant}'. Please ensure that folders are available and that the folder name is spelled correctly.`;
                }
            }

            return { 'X-UIPATH-OrganizationUnitId': this.folders[folderName] };
        }


        //////////////////////////////
        /*ACTIONS*/
        //////////////////////////////

        this.auth.getToken({...config, ...this.credentials})
            .catch( (e) => { this.error(this.standardError); });
    }
    

    /*Store credentials*/
    RED.nodes.registerType("orchestrator connection",OrchestratorConnectionNode, {
    	credentials: {
            password: {type:"password"},
            userKey: {type: "password"}
        }
    });
}