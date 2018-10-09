"use strict";

class Utilities {

	static checkConnection(connection) {
        if (!connection)
            throw "Please add Login credentials before making requests.";
	}

	static convertParams(params, msg, node, RED) {
        var body = {};
        
        for (var [i, p] of params.entries()) {
            var val = p.value;

            switch(p.type) {
                case 'msg':
                    val = RED.util.getMessageProperty(msg, "msg." + p.value); break;
                case 'json':
                    val = JSON.parse(p.value); break;
                case 'flow':
                    val = node.context().flow.get(p.value); break;
                case 'global':
                    val = node.context().global.get(p.value); break;
                case 'date':
                    val = Date.now(); break;
                case 'jsonata':
                    try {
                        var prep = RED.util.prepareJSONataExpression(p.value, msg);
                        val = RED.util.evaluateJSONataExpression(prep, msg);
                    } catch(err) {
                        console.log(err);
                        throw "Invalid JSONata expression";
                    }
                    break;
            }

            body[p.key || i] = val;
        }

        return body;
    }

    static pullHeaders(data) {
        /*Org Units*/
        var headers = {};
        for (var key of Object.keys(data).filter((key) => /^X-UIPATH/.test(key))) {
            headers[key] = data[key];
            delete data[key];
        }

        return [data, headers];
    }
}

module.exports = Utilities;