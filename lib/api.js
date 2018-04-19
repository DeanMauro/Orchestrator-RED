"use strict";

class Api {

	static convertParams(params, msg) {
		var body = {};
		
		for (var p of params) {
			var val = (p.type == "msg") ? msg[p.value] : p.value;					// Look out for msg params
			body[p.key] = (val.toString().startsWith("{")) ? JSON.parse(val) : val;	// Look out for JSON params
		}

		return body;
	}

	static fillPath(action, path, params) {
		/*Path Params*/		
		for (var target of (path.match(/\{\w+\}/g) || [])) {
			var key = target.slice(1, -1);

			if (params[key])
				path = path.replace(target, params[key]);
			else
				throw "Path Parameter '" + key + "' is missing. Please add it and try again.";
		}

		/*Query Params*/
		if (action == "GET") {
			var qString = "?";

			// Combine all query params, which start with $
			for (var key of Object.keys(params).filter((key) => /\$.*/.test(key)))
				qString += (key + "=" + params[key] + "&");

			// If query params existed, remove last '&'' and append to path
			if (qString != "?") 
				path += qString.slice(0, -1)
		}

		return path;
	}

	static Alerts(action) {
		return {
			GetAll: ["GET", "odata/Alerts"],
			GetUnreadCount: ["GET", "odata/Alerts/UiPath.Server.Configuration.OData.GetUnreadCount()"],
			MarkAsRead: ["POST", "odata/Alerts/UiPath.Server.Configuration.OData.MarkAsRead"],
			RaiseProcessAlert: ["POST", "/odata/Alerts/UiPath.Server.Configuration.OData.RaiseProcessAlert"]
		}[action]
	}

	static Assets(action) {
		return {
			GetAll: ["GET", "odata/Assets"],
			Create: ["POST", "odata/Assets"],
			Delete: ["DELETE", "odata/Assets({Id})"],
			Edit: ["PUT", "odata/Assets({Id})"],
			GetRobotAsset: ["GET", "odata/Assets/UiPath.Server.Configuration.OData.GetRobotAsset(robotId='{robotId}',assetName='{assetName}')"]
		}[action]
	}

	static AuditLogs(action) {
		return {
			GetAll: ["GET", "odata/AuditLogs"],
			GetAuditLogDetails: ["GET", "/odata/AuditLogs/UiPath.Server.Configuration.OData.GetAuditLogDetails(auditLogId={auditLogId})"]
		}[action]
	}

	static Environments(action) {
		return {
			GetAll: ["GET", "odata/Environments"],
			GetOne: ["GET", "odata/Environments({Id})"],
			Create: ["POST", "odata/Environments"],
			Delete: ["DELETE", "odata/Environments({Id})"],
			Update: ["PUT", "odata/Environments({Id})"],
			GetRobotsForEnvironment: ["GET", "odata/Environments/UiPath.Server.Configuration.OData.GetRobotsForEnvironment(key={key})"],
			GetRobotIdsForEnvironment: ["GET", "/odata/Environments/UiPath.Server.Configuration.OData.GetRobotIdsForEnvironment(key={key})"],
			AddRobot: ["POST", "odata/Environments({Id})/UiPath.Server.Configuration.OData.AddRobot"],
			RemoveRobot: ["POST", "odata/Environments({Id})/UiPath.Server.Configuration.OData.RemoveRobot"],
			SetRobts: ["POST", "/odata/Environments({Id})/UiPath.Server.Configuration.OData.SetRobots"]
		}[action]
	}

	static Jobs(action) {
		return {
			GetAll: ["GET", "odata/Jobs"],
			GetOne: ["GET", "odata/Jobs({Id})"],
			Create: ["POST", "odata/Jobs"],
			Update: ["PUT", "odata/Jobs({Id})"],
			StartJobs: ["POST", "odata/Jobs/UiPath.Server.Configuration.OData.StartJobs"],
			StopJob: ["POST", "odata/Jobs({Id})/UiPath.Server.Configuration.OData.StopJob"]
		}[action]
	}

	static OrganizationUnits(action) {
		return {
			GetAll: ["GET", "/odata/OrganizationUnits"],
			GetOne: ["GET", "/odata/OrganizationUnits({Id})"],
			Create: ["POST", "/odata/OrganizationUnits"],
			Delete: ["DELETE", "/odata/OrganizationUnits({Id})"],
			Edit: ["PUT", "/odata/OrganizationUnits({Id})"],
			GetUsersForUnit: ["GET", "/odata/OrganizationUnits/UiPath.Server.Configuration.OData.GetUsersForUnit(key={key})"],
			GetUserIdsForUnit: ["GET", "/odata/OrganizationUnits/UiPath.Server.Configuration.OData.GetUserIdsForUnit(key={key})"],
			SetUsers: ["POST", "/odata/OrganizationUnits({Id})/UiPath.Server.Configuration.OData.SetUsers"]
		}[action]
	}

	static Permissions(action) {
		return {
			GetAll: ["GET", "odata/Permissions"]
		}[action]
	}

	static Processes(action) {
		return {
			GetAll: ["GET", "odata/Processes"],
			Delete: ["DELETE", "odata/Processes('{Id}')"],
			GetProcessVersions: ["GET", "odata/Processes/UiPath.Server.Configuration.OData.GetProcessVersions(processId='{processId}')"]
		}[action]
	}

	static ProcessSchedules(action) {
		return {
			GetAll: ["GET", "odata/ProcessSchedules"],
			GetOne: ["GET", "odata/ProcessSchedules({Id})"],
			Create: ["POST", "odata/ProcessSchedules"],
			Delete: ["DELETE", "odata/ProcessSchedules({Id})"],
			Edit: ["PUT", "odata/ProcessSchedules({Id})"],
			SetEnabled: ["POST", "odata/ProcessSchedules/UiPath.Server.Configuration.OData.SetEnabled"],
			GetRobotIdsForSchedule: ["GET", "/odata/ProcessSchedules/UiPath.Server.Configuration.OData.GetRobotIdsForSchedule(key={key})"]
		}[action]
	}

	static QueueDefinitions(action) {
		return {
			GetAll: ["GET", "odata/QueueDefinitions"],
			GetOne: ["GET", "odata/QueueDefinitions"],
			Create: ["POST", "/odata/QueueDefinitions({Id})"],
			Delete: ["DELETE", "odata/QueueDefinitions({Id})"],
			Edit: ["PUT", "odata/QueueDefinitions({Id})"]
		}[action]
	}

	static QueueItemComments(action) {
		return {
			GetAll: ["GET", "odata/QueueItemComments"],
			GetOne: ["GET", "odata/QueueItemComments({Id})"],
			Create: ["POST", "odata/QueueItemComments"],
			Delete: ["DELETE", "odata/QueueItemComments({Id})"],
			Update: ["PUT", "odata/QueueItemComments({Id})"],
			GetQueueItemCommentsHistory: ["GET", "odata/QueueItemComments/UiPath.Server.Configuration.OData.GetQueueItemCommentsHistory(queueItemId={queueItemId})"]
		}[action]
	}

	static QueueItemEvents(action) {
		return {
			GetAll: ["GET", "odata/QueueItemEvents"],
			GetOne: ["GET", "odata/QueueItemEvents({Id})"],
			GetQueueItemEventsHistory: ["GET", "/odata/QueueItemEvents/UiPath.Server.Configuration.OData.GetQueueItemEventsHistory(queueItemId={queueItemId})"]
		}[action]
	}

	static QueueItems(action) {
		return {
			GetAll: ["GET", "odata/QueueItems"],
			GetOne: ["GET", "odata/QueueItems({Id})"],
			Delete: ["DELETE", "odata/QueueItems({Id})"],
			Create: ["POST", "odata/QueueItems"],
			Replace: ["PUT", "odata/QueueItems({Id})"],
			Update: ["PATCH", "odata/QueueItems({Id})"],
			GetItemProcessingHistory: ["GET", "odata/QueueItems({Id})/UiPathODataSvc.GetItemProcessingHistory()"],
			SetItemReviewStatus: ["POST", "odata/QueueItems/UiPathODataSvc.SetItemReviewStatus"],
			DeleteBulk: ["POST", "odata/QueueItems/UiPathODataSvc.DeleteBulk"],
			SetTransactionProgress: ["POST", "odata/QueueItems({Id})/UiPathODataSvc.SetTransactionProgress"],
			SetItemReviewer: ["POST", "/odata/QueueItems/UiPathODataSvc.SetItemReviewer"],
			UnsetItemReviewer: ["POST", "/odata/QueueItems/UiPathODataSvc.UnsetItemReviewer"],
			GetReviewers: ["GET", "/odata/QueueItems/UiPath.Server.Configuration.OData.GetReviewers()"]
		}[action]
	}

	static QueueProcessingRecords(action) {
		return {
			GetAll: ["GET", "odata/QueueProcessingRecords"],
			GetOne: ["GET", "odata/QueueProcessingRecords({Id})"],
			Create: ["POST", "odata/QueueProcessingRecords"],
			Delete: ["DELETE", "odata/QueueProcessingRecords({Id})"],
			RetrieveLastDaysProcessingRecords: ["GET", "odata/QueueProcessingRecords/UiPathODataSvc.RetrieveLastDaysProcessingRecords(daysNo={daysNo},queueDefinitionId={queueDefinitionId})"],
			RetrieveQueuesProcessingStatus: ["GET", "odata/QueueProcessingRecords/UiPathODataSvc.RetrieveQueuesProcessingStatus()"]
		}[action]
	}

	static Queues(action) {
		return {
			GetAll: ["GET", "odata/Queues"],
			GetOne: ["GET", "odata/Queues({Id})"],
			AddQueueItem: ["POST", "odata/Queues/UiPathODataSvc.AddQueueItem"],
			StartTransaction: ["POST", "odata/Queues/UiPathODataSvc.StartTransaction"],
			SetTransactionResult: ["POST", "odata/Queues({Id})/UiPathODataSvc.SetTransactionResult"]
		}[action]
	}

	static Releases(action) {
		return {
			GetAll: ["GET", "odata/Releases"],
			GetOne: ["GET", "odata/Releases({Id})"],
			Create: ["POST", "odata/Releases"],
			Delete: ["DELETE", "odata/Releases({Id})"],
			Edit: ["PUT", "odata/Releases({Id})"],
			UpdateToSpecificPackageVersion: ["POST", "odata/Releases({Id})/UiPath.Server.Configuration.OData.UpdateToSpecificPackageVersion"],
			UpdateToLatestPackageVersion: ["POST", "odata/Releases({Id})/UiPath.Server.Configuration.OData.UpdateToLatestPackageVersion"],
			RollbackToPreviousReleaseVersion: ["POST", "odata/Releases({Id})/UiPath.Server.Configuration.OData.RollbackToPreviousReleaseVersion"]
		}[action]
	}

	static RobotLogs(action) {
		return {
			GetAll: ["GET", "odata/RobotLogs"],
			Reports: ["GET", "odata/RobotLogs/UiPath.Server.Configuration.OData.Reports()"]
		}[action]
	}

	static Robots(action) {
		return {
			GetAll: ["GET", "odata/Robots"],
			GetOne: ["GET", "odata/Robots({Id})"],
			Create: ["POST", "odata/Robots"],
			Delete: ["DELETE", "odata/Robots({Id})"],
			Edit: ["PUT", "odata/Robots({Id})"],
			GetMachineNameToLicenseKeyMappings: ["GET", "odata/Robots/UiPath.Server.Configuration.OData.GetMachineNameToLicenseKeyMappings()"]
		}[action]
	}

	static Roles(action) {
		return {
			GetAll: ["GET", "odata/Roles"],
			Create: ["POST", "odata/Roles"],
			Delete: ["DELETE", "odata/Roles({Id})"],
			Edit: ["PUT", "odata/Roles({Id})"],
			GetUsersForRole: ["GET", "/odata/Roles/UiPath.Server.Configuration.OData.GetUsersForRole(key={key})"],
			GetUserIdsForRole: ["GET", "/odata/Roles/UiPath.Server.Configuration.OData.GetUserIdsForRole(key={key})"],
			SetUsers: ["POST", "/odata/Roles({Id})/UiPath.Server.Configuration.OData.SetUsers"]
		}[action]
	}

	static Sessions(action) {
		return {
			GetAll: ["GET", "odata/Sessions"]
		}[action]
	}

	static Stats(action) {
		return {
			GetCountStats: ["GET", "api/Stats/GetCountStats"],
			GetSessionsStats: ["GET", "api/Stats/GetSessionsStats"],
			GetJobsStats: ["GET", "api/Stats/GetJobsStats"]
		}[action]
	}

	static Tenants(action) {
		return {
			GetAll: ["GET", "odata/Tenants"],
			GetOne: ["GET", "/odata/Tenants({Id})"],
			Create: ["POST", "odata/Tenants"],
			Delete: ["DELETE", "/odata/Tenants({Id})"],
			Edit: ["PUT", "odata/Tenants({Id})"],
			SetActive: ["POST", "/odata/Tenants/UiPath.Server.Configuration.OData.SetActive"]
		}[action]
	}

	static Users(action) {
		return {
			GetAll: ["GET", "odata/Users"],
			GetOne: ["GET", "odata/Users({Id})"],
			Create: ["POST", "odata/Users"],
			Delete: ["DELETE", "odata/Users({Id})"],
			Edit: ["PUT", "odata/Users({Id})"],
			GetCurrentPermissions: ["GET", "odata/Users/UiPath.Server.Configuration.OData.GetCurrentPermissions()"],
			GetCurrentUser: ["GET", "odata/Users/UiPath.Server.Configuration.OData.GetCurrentUser()"],
			ToggleRole: ["POST", "odata/Users({Id})/UiPath.Server.Configuration.OData.ToggleRole"],
			ToggleOrganizationUnit: ["POST", "/odata/Users({Id})/UiPath.Server.Configuration.OData.ToggleOrganizationUnit"],
			ImportUsers: ["POST", "odata/Users/UiPath.Server.Configuration.OData.ImportUsers"],
			ChangePassword: ["POST", "odata/Users({Id})/UiPath.Server.Configuration.OData.ChangePassword"],
			SetActive: ["POST", "/odata/Users({Id})/UiPath.Server.Configuration.OData.SetActive"]
		}[action]
	}
}

module.exports = Api;