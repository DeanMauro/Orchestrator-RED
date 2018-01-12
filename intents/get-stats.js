module.exports = function(RED) {
    function GetStatsNode(config) {
        RED.nodes.createNode(this,config);

        this.on('input', function(msg) {
        	Orchestrator.refreshToken(this);

            // Put call here
        });
    }
    
    RED.nodes.registerType("get-stats", GetStatsNode);
}