const Api = require('../lib/api.js');
const Utilities = require('../lib/utilities.js');

module.exports = function(RED) {
    function OrchestratorStartJobNode(config) {
        RED.nodes.createNode(this,config);

        this.on('input', function(msg) {

            var node = this;
            var connection = RED.nodes.getNode(config.connection);
            var data = {};

            // Ensure node has connection
            Utilities.checkConnection(connection);

            try {
                // Select Params
                if (config.params.length != 0)
                    data = Utilities.convertParams(config.params, msg, node);

                // Get endpoint info
                var endpoint = Api["Jobs"]("StartJobs");

                // Add path & query params if needed
                var extension = Api.fillPath(endpoint[0], endpoint[1], data);

                // Sanitize data
                if (data && data["Id"]) data["Id"] = parseInt(data["Id"]);

                // Fire!
                connection.request({ method: endpoint[0], 
                                     url: extension,
                                     data: data })
                            .then(r => {
                                node.send({payload: r.data});
                            })
                            .catch(e => {
                                node.error(e.response || e.message);
                            });
            } catch(e) {
                errorOut(node, e);
            }
        });
    }
    
    RED.nodes.registerType("orchestrator start job", OrchestratorStartJobNode);
}