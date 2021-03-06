# Orchestrator-RED
A Node-RED wrapper for the UiPath Orchestrator API

## Release Notes

**v2.2.0**

- SUPPORT FOR FOLDERS: Orchestrator version 19.10 brought the concept of Folders, which sequester resources within a tenant. Now, our Request and Start-Job nodes support this with a Folder field in which users can specify a folder by name. 
- Users with Orchestrators below v19.10 who still want to use Organization Units can specify an org unit by putting *X-UiPath-OrganizationUnitId* in the parameter list of a node. Note that the Default folder ID is different for every tenant. Use the Orchestrator API to retrieve this ID.

**v2.1.1**

- The Request node now wraps the 2019.12 API, which includes several new calls.

**v2.0.0**

- Now supports both Cloud and On-Premise Orchestrators, which use different authentication schemes. For more information, see the official [UiPath documentation here](https://docs.uipath.com/orchestrator/reference#consuming-cloud-api).
- BREAKING CHANGE: The URL field no longer defaults to https://platform.uipath.com. Connection nodes without a value in the URL field will fail.

## Install

1. Install [Node.js](https://nodejs.org/en/download/) and [node-RED](https://nodered.org/docs/getting-started/installation).

2. Navigate to your node-RED directory and run `npm install @uipath/node-red-contrib-uipath-orchestrator` OR

3. Start node-RED, navigate to the hamburger menu in the top right corner, select *Manage Palette*, and add the UiPath Orchestrator nodes.

## Nodes

### Connection

A configuration node that authenticates all calls made to Orchestrator and automatically refreshes API tokens when needed.

**ON PREMISE**

* **URL**: The URL of your Orchestrator instance.
* **Tenant**: Your tenant
* **Username**: Your username
* **Password**: Your password. This value is encrypted when the flow is saved.

**CLOUD**

* **User Key**: The secret key that identifies your user.
* **Account**: The logical name of your account at https://platform.uipath.com.
* **Tenant**: The logical name of the tenant (AKA service) to which you want to connect. Each account may support multiple tenants
* **Client ID**: The unique identifier of https://platform.uipath.com.

### Request

A wrapper of the full Orchestrator API allowing any request to be made. Currently configured for v2019.12.

* **Login**: The connection node used to authenticate all calls.
* **Folder**: The name of the folder in which to operate (defaults to "Default").
* **Category**: The targeted Orchestrator element *(e.g. robots, queues, assets)*
* **Action**: The list of actions available in the selected category *(e.g. Get All, Add to queue, Delete Asset)*
* **Parameters**: *optional* Input parameters for the specified action. Formatted as per the Swagger guidelines

### Start Job

A convenience node that starts a Job.

* **Login**: The connection node used to authenticate.
* **Folder**: The name of the folder in which to operate (defaults to "Default").
* **Process**: The name and environment of the process to be run. If no environment is provided, the first one found to contain the selected process will be used. As of 2018.3, input parameters are available when starting a Job.
* **Robot(s)**: The robot scheme used to run the job. You may specify robots by name, quantity, or run on all robots. If an incorrect robot name is specified, no jobs will run. If a larger number of robots than are available is specified to run, the job will proceed on all robots.

## Output Messages

The raw JSON output of each API call is included in the msg.payload in order to expose all details.
