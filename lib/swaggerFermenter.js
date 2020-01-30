const doc = require('./swagger.json');
const fs = require('fs');

class swaggerFermenter {
	constructor() {
		this.distilled = {};
		this.api = '';
	}

	distill() {
		// Exclude useless API calls
		var exclusions = new RegExp("^(/api/Account|/api/Maintenance|/api/RobotsService|/api/Status|/odata/Calendars|/odata/HostLicenses|/odata//MessageTemplates|/odata/Settings|/api/Translations|/odata/UserLoginAttempts)");

		// For each category in the API
		for(const [key, value] of Object.entries(doc.paths)){

			// Ignore the excluded categories
			if (!exclusions.test(key)) {

				var category = '';
				
				// Pull out verb, category, action, and parameters for each call
				for(const [k, v] of Object.entries(value)) {
					category = v.tags[0];
					var details = {
						endpoint: key,
						verb: k,
						category: category,
						action: this.flavor(category, v.operationId.split("_").pop()),
						params: v.parameters
					};

					// If the category doesn't already exist, add it to the object
					if (!this.distilled[category]) 
						this.distilled[category] = [];

					// Add each call to that category
					this.distilled[category].push(details);
				}
			}
		}
	}

	flavor(category, action) {
		switch(action) {
			case 'Get'+category: return 'GetAll';
			case 'Post': return 'Create';
			case 'GetById': return 'GetById';
			case 'PutById': return 'Edit';
			case 'PatchById': return 'Update'
			default: return action.replace(/ById$/,'');
		}
	}

	cellar() {
		// Template each call (with indents included)
		var apiTemplate = `static <CATEGORY>(action) {
		return {
			<ACTIONS>
		}[action]
	}

	`;
		var actionTemplate = `,
			<ACTION>: ["<VERB>", "<ENDPOINT>"]`;

		// Go through each category of the API
		for(const [key, value] of Object.entries(this.distilled).sort((a, b) => a[0] < b[0] ? -1 : 1)){
			var actions = '';

			// Create a new action line for each call in that category
			for(var call of value){
				actions += actionTemplate.replace('<ACTION>', call['action'])
										 .replace('<VERB>', call['verb'])
										 .replace('<ENDPOINT>', call['endpoint']);
			}
			actions = actions.replace(',\n\t\t\t','');

			// Add the action lines into a template of the category's method
			this.api += apiTemplate.replace('<CATEGORY>', key)
								   .replace('<ACTIONS>', actions);
		}

		// Save API to a temp file
		fs.writeFile('newApi.txt', this.api, (err) => {  
		    if (err) throw err;
			console.log('API saved!');
		});
	}

	carbonate(str) {
		// Split Pascal Case
		return str.replace(/([a-z])([A-Z])/g,'$1 $2');
	}

	bottle() {
		var categories = '';
		var options = '';
		var optTemplate = '<option value="<ACTION>" class="<CATEGORY>"><COLLOQUIAL></option>\n';

		// Go through each category of the API
		for(const [key, value] of Object.entries(this.distilled).sort((a, b) => a[0] < b[0] ? -1 : 1)){
			// Create category select
			categories += `\t\t\t<option value="${key}">${key}</option>\n`;

			// Create category comment
			options += `\t\t\t<!-- ${key} -->\n`;

			// Create a new action line for each call in that category
			for(var call of value){
				options += `\t\t\t<option value="${call['action']}" class="${key}">${this.carbonate(call['action'])}</option>\n`;
			}
		}
		
		// Save Request HTML to a temp file
		fs.writeFile('newRequest.txt', categories +'\n\n'+ options, (err) => {  
		    if (err) throw err;
			console.log('Request HTML saved!');
		});
	}


}

var vat = new swaggerFermenter();
vat.distill();
vat.cellar();
vat.bottle();
console.log(vat.distilled);
