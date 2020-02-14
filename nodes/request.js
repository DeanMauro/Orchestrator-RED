const Api = require('../lib/api.js');
const Utilities = require('../lib/utilities.js');

module.exports = function(RED) {
    function OrchestratorRequestNode(config) {
        RED.nodes.createNode(this,config);

        this.on('input', async function(msg) {

            var node = this;
            var connection = RED.nodes.getNode(config.connection);
            var data = {};
            var headers = {};

            // Properties Input
            try {
                // Ensure node has connection
                Utilities.checkConnection(connection);

                // Compose header with Folder ID
                var folderHeader = await connection.getFolderId(config.folder);
                headers = {...headers, ...folderHeader};

                // Convert fields provided through msg variable
                if (config.category.startsWith("Msg")) {
                    config.category = msg.payload.category;
                    config.action = msg.payload.action;
                }

                // Select Params
                if (config.params.length != 0)
                    data = Utilities.convertParams(config.params, msg, node, RED);
                else if (msg.payload.params)
                    data = msg.payload.params;

                // Check that a category and action were specified
                if (!config.category) throw "That request was rather vague. Please specify a category in the node's properties."
                if (!config.action) throw "That request was rather vague. Please specify an action in the node's properties."

                // Get endpoint info
                var endpoint = Api[config.category](config.action);

                // Add path & query params if needed
                var extension = Api.fillPath(endpoint[0], endpoint[1], data);

                // Sanitize data
                if (data && data["Id"]) data["Id"] = parseInt(data["Id"]);

                // Get headers
                [data, headers] = Utilities.pullHeaders(data, headers);

                // Fire!
                var res = await connection.request({ method: endpoint[0], 
                                                     url: extension,
                                                     data: data,
                                                     headers: headers });
                
                msg.payload = res;
                node.send(msg);
            } catch(e) {
                if (e.response) ['request','config','headers'].forEach(k => {delete e.response[k]});
                this.error(e.response || e.message || e);
            }

        });
    }

    RED.nodes.registerType("orchestrator request", OrchestratorRequestNode);
}