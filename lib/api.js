"use strict";

class Api {

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
		if (action == "get") {
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
			GetAll: ["get", "/odata/Alerts"],
			GetUnreadCount: ["get", "/odata/Alerts/UiPath.Server.Configuration.OData.GetUnreadCount()"],
			MarkAsRead: ["post", "/odata/Alerts/UiPath.Server.Configuration.OData.MarkAsRead"],
			RaiseProcessAlert: ["post", "/odata/Alerts/UiPath.Server.Configuration.OData.RaiseProcessAlert"]
		}[action]
	}

	static Assets(action) {
		return {
			GetAll: ["get", "/odata/Assets"],
			Create: ["post", "/odata/Assets"],
			Delete: ["delete", "/odata/Assets({Id})"],
			Edit: ["put", "/odata/Assets({Id})"],
			GetRobotAsset: ["get", "/odata/Assets/UiPath.Server.Configuration.OData.GetRobotAsset(robotId='{robotId}',assetName='{assetName}')"],
			GetRobotAsset: ["get", "/odata/Assets/UiPath.Server.Configuration.OData.GetRobotAssetByRobotId(robotId={robotId},assetName='{assetName}')"]
		}[action]
	}

	static AuditLogs(action) {
		return {
			GetAll: ["get", "/odata/AuditLogs"],
			GetAuditLogDetails: ["get", "/odata/AuditLogs/UiPath.Server.Configuration.OData.GetAuditLogDetails(auditLogId={auditLogId})"]
		}[action]
	}

	static Environments(action) {
		return {
			GetAll: ["get", "/odata/Environments"],
			GetOne: ["get", "/odata/Environments({Id})"],
			Create: ["post", "/odata/Environments"],
			Delete: ["delete", "/odata/Environments({Id})"],
			Update: ["put", "/odata/Environments({Id})"],
			GetRobotsForEnvironment: ["get", "/odata/Environments/UiPath.Server.Configuration.OData.GetRobotsForEnvironment(key={key})"],
			GetRobotIdsForEnvironment: ["get", "/odata/Environments/UiPath.Server.Configuration.OData.GetRobotIdsForEnvironment(key={key})"],
			AddRobot: ["post", "/odata/Environments({Id})/UiPath.Server.Configuration.OData.AddRobot"],
			RemoveRobot: ["post", "/odata/Environments({Id})/UiPath.Server.Configuration.OData.RemoveRobot"],
			SetRobts: ["post", "/odata/Environments({Id})/UiPath.Server.Configuration.OData.SetRobots"]
		}[action]
	}

	static HostLicenses(action) {
		return {
			GetAll: ["get", "/odata/HostLicenses"],
			GetOne: ["get", "/odata/HostLicenses({Id})"],
			GetTenantLicense: ["get", "/odata/HostLicenses/UiPath.Server.Configuration.OData.GetTenantLicense(tenantId={tenantId})"],
			DeleteTenantLicense: ["post", "/odata/HostLicenses/UiPath.Server.Configuration.OData.DeleteTenantLicense"],
			SetTenantLicense: ["post", "/odata/HostLicenses/UiPath.Server.Configuration.OData.SetTenantLicense"]
		}[action]
	}

	static Jobs(action) {
		return {
			GetAll: ["get", "/odata/Jobs"],
			GetOne: ["get", "/odata/Jobs({Id})"],
			Create: ["post", "/odata/Jobs"],
			Update: ["put", "/odata/Jobs({Id})"],
			StartJobs: ["post", "/odata/Jobs/UiPath.Server.Configuration.OData.StartJobs"],
			StopJob: ["post", "/odata/Jobs({Id})/UiPath.Server.Configuration.OData.StopJob"],
			StopJobs: ["post", "/odata/Jobs/UiPath.Server.Configuration.OData.StopJobs"]
		}[action]
	}

	static Libraries(action) {
		return {
			GetAll: ["get", "/odata/Libraries"],
			Delete: ["delete", "/odata/Libraries('{Id}')"],
			GetVersions: ["get", "/odata/Libraries/UiPath.Server.Configuration.OData.GetVersions(packageId='{packageId}')"]
		}[action]
	}

	static Logs(action) {
		return {
			Create: ["post", "/api/Logs"],
			SubmitLogs: ["post", "/api/SubmitLogs"]
		}[action]
	}

	static Licenses(action) {
		return {
			GetLicensesNamedUser: ["get", "/odata/LicensesNamedUser/UiPath.Server.Configuration.OData.GetLicensesNamedUser(robotType='{robotType}')"],
			GetLicensesRuntime: ["get", "/odata/LicensesRuntime/UiPath.Server.Configuration.OData.GetLicensesRuntime(robotType='{robotType}')"]
		}[action]
	}

	static Machines(action) {
		return {
			GetAll: ["get", "/odata/Machines"],
			GetOne: ["get", "/odata/Machines({Id})"],
			DeleteBulk: ["post", "/odata/Machines/UiPath.Server.Configuration.OData.DeleteBulk"]
		}[action]
	}

	static OrganizationUnits(action) {
		return {
			GetAll: ["get", "/odata/OrganizationUnits"],
			GetOne: ["get", "/odata/OrganizationUnits({Id})"],
			Create: ["post", "/odata/OrganizationUnits"],
			Delete: ["delete", "/odata/OrganizationUnits({Id})"],
			Edit: ["put", "/odata/OrganizationUnits({Id})"],
			GetUsersForUnit: ["get", "/odata/OrganizationUnits/UiPath.Server.Configuration.OData.GetUsersForUnit(key={key})"],
			GetUserIdsForUnit: ["get", "/odata/OrganizationUnits/UiPath.Server.Configuration.OData.GetUserIdsForUnit(key={key})"],
			SetUsers: ["post", "/odata/OrganizationUnits({Id})/UiPath.Server.Configuration.OData.SetUsers"]
		}[action]
	}

	static Permissions(action) {
		return {
			GetAll: ["get", "/odata/Permissions"]
		}[action]
	}

	static Processes(action) {
		return {
			GetAll: ["get", "/odata/Processes"],
			Delete: ["delete", "/odata/Processes('{Id}')"],
			GetProcessVersions: ["get", "/odata/Processes/UiPath.Server.Configuration.OData.GetProcessVersions(processId='{processId}')"],
			GetArguments: ["get", "/odata/Processes/UiPath.Server.Configuration.OData.GetArguments(key='{key}')"],
			SetArguments: ["post", "/odata/Processes/UiPath.Server.Configuration.OData.SetArguments"],
		}[action]
	}

	static ProcessSchedules(action) {
		return {
			GetAll: ["get", "/odata/ProcessSchedules"],
			GetOne: ["get", "/odata/ProcessSchedules({Id})"],
			Create: ["post", "/odata/ProcessSchedules"],
			Delete: ["delete", "/odata/ProcessSchedules({Id})"],
			Edit: ["put", "/odata/ProcessSchedules({Id})"],
			SetEnabled: ["post", "/odata/ProcessSchedules/UiPath.Server.Configuration.OData.SetEnabled"],
			GetRobotIdsForSchedule: ["get", "/odata/ProcessSchedules/UiPath.Server.Configuration.OData.GetRobotIdsForSchedule(key={key})"]
		}[action]
	}

	static QueueDefinitions(action) {
		return {
			GetAll: ["get", "/odata/QueueDefinitions"],
			GetOne: ["get", "/odata/QueueDefinitions"],
			Create: ["post", "/odata/QueueDefinitions({Id})"],
			Delete: ["delete", "/odata/QueueDefinitions({Id})"],
			Edit: ["put", "/odata/QueueDefinitions({Id})"]
		}[action]
	}

	static QueueItemComments(action) {
		return {
			GetAll: ["get", "/odata/QueueItemComments"],
			GetOne: ["get", "/odata/QueueItemComments({Id})"],
			Create: ["post", "/odata/QueueItemComments"],
			Delete: ["delete", "/odata/QueueItemComments({Id})"],
			Update: ["put", "/odata/QueueItemComments({Id})"],
			GetQueueItemCommentsHistory: ["get", "/odata/QueueItemComments/UiPath.Server.Configuration.OData.GetQueueItemCommentsHistory(queueItemId={queueItemId})"]
		}[action]
	}

	static QueueItemEvents(action) {
		return {
			GetAll: ["get", "/odata/QueueItemEvents"],
			GetOne: ["get", "/odata/QueueItemEvents({Id})"],
			GetQueueItemEventsHistory: ["get", "/odata/QueueItemEvents/UiPath.Server.Configuration.OData.GetQueueItemEventsHistory(queueItemId={queueItemId})"]
		}[action]
	}

	static QueueItems(action) {
		return {
			GetAll: ["get", "/odata/QueueItems"],
			GetOne: ["get", "/odata/QueueItems({Id})"],
			Delete: ["delete", "/odata/QueueItems({Id})"],
			Create: ["post", "/odata/QueueItems"],
			Replace: ["put", "/odata/QueueItems({Id})"],
			Update: ["patch", "/odata/QueueItems({Id})"],
			GetItemProcessingHistory: ["get", "/odata/QueueItems({Id})/UiPathODataSvc.GetItemProcessingHistory()"],
			SetItemReviewStatus: ["post", "/odata/QueueItems/UiPathODataSvc.SetItemReviewStatus"],
			DeleteBulk: ["post", "/odata/QueueItems/UiPathODataSvc.DeleteBulk"],
			SetTransactionProgress: ["post", "/odata/QueueItems({Id})/UiPathODataSvc.SetTransactionProgress"],
			SetItemReviewer: ["post", "/odata/QueueItems/UiPathODataSvc.SetItemReviewer"],
			UnsetItemReviewer: ["post", "/odata/QueueItems/UiPathODataSvc.UnsetItemReviewer"],
			GetReviewers: ["get", "/odata/QueueItems/UiPath.Server.Configuration.OData.GetReviewers()"]
		}[action]
	}

	static QueueProcessingRecords(action) {
		return {
			GetAll: ["get", "/odata/QueueProcessingRecords"],
			GetOne: ["get", "/odata/QueueProcessingRecords({Id})"],
			Create: ["post", "/odata/QueueProcessingRecords"],
			Delete: ["delete", "/odata/QueueProcessingRecords({Id})"],
			RetrieveLastDaysProcessingRecords: ["get", "/odata/QueueProcessingRecords/UiPathODataSvc.RetrieveLastDaysProcessingRecords(daysNo={daysNo},queueDefinitionId={queueDefinitionId})"],
			RetrieveQueuesProcessingStatus: ["get", "/odata/QueueProcessingRecords/UiPathODataSvc.RetrieveQueuesProcessingStatus()"]
		}[action]
	}

	static Queues(action) {
		return {
			GetAll: ["get", "/odata/Queues"],
			GetOne: ["get", "/odata/Queues({Id})"],
			AddQueueItem: ["post", "/odata/Queues/UiPathODataSvc.AddQueueItem"],
			StartTransaction: ["post", "/odata/Queues/UiPathODataSvc.StartTransaction"],
			SetTransactionResult: ["post", "/odata/Queues({Id})/UiPathODataSvc.SetTransactionResult"]
		}[action]
	}

	static Releases(action) {
		return {
			GetAll: ["get", "/odata/Releases"],
			GetOne: ["get", "/odata/Releases({Id})"],
			Create: ["post", "/odata/Releases"],
			Delete: ["delete", "/odata/Releases({Id})"],
			Edit: ["put", "/odata/Releases({Id})"],
			UpdateToSpecificPackageVersion: ["post", "/odata/Releases({Id})/UiPath.Server.Configuration.OData.UpdateToSpecificPackageVersion"],
			UpdateToLatestPackageVersion: ["post", "/odata/Releases({Id})/UiPath.Server.Configuration.OData.UpdateToLatestPackageVersion"],
			RollbackToPreviousReleaseVersion: ["post", "/odata/Releases({Id})/UiPath.Server.Configuration.OData.RollbackToPreviousReleaseVersion"]
		}[action]
	}

	static RobotLogs(action) {
		return {
			GetAll: ["get", "/odata/RobotLogs"],
			GetTotalCount: ["get", "/odata/RobotLogs/UiPath.Server.Configuration.OData.GetTotalCount()"]
		}[action]
	}

	static Robots(action) {
		return {
			GetAll: ["get", "/odata/Robots"],
			GetOne: ["get", "/odata/Robots({Id})"],
			Create: ["post", "/odata/Robots"],
			Delete: ["delete", "/odata/Robots({Id})"],
			Edit: ["put", "/odata/Robots({Id})"],
			GetMachineNameToLicenseKeyMappings: ["get", "/odata/Robots/UiPath.Server.Configuration.OData.GetMachineNameToLicenseKeyMappings()"],
			GetUsernames: ["get", "/odata/Robots/UiPath.Server.Configuration.OData.GetUsernames()"],
			GetRobotsForProcess: ["get", "/odata/Robots/UiPath.Server.Configuration.OData.GetRobotsForProcess(processId='{processId}')"],
			DeleteBulk: ["post", "/odata/Robots/UiPath.Server.Configuration.OData.DeleteBulk"],
			ConvertToFloating: ["post", "/odata/Robots/UiPath.Server.Configuration.OData.ConvertToFloating"]
		}[action]
	}

	static Roles(action) {
		return {
			GetAll: ["get", "/odata/Roles"],
			Create: ["post", "/odata/Roles"],
			Delete: ["delete", "/odata/Roles({Id})"],
			Edit: ["put", "/odata/Roles({Id})"],
			GetUsersForRole: ["get", "/odata/Roles/UiPath.Server.Configuration.OData.GetUsersForRole(key={key})"],
			GetUserIdsForRole: ["get", "/odata/Roles/UiPath.Server.Configuration.OData.GetUserIdsForRole(key={key})"],
			SetUsers: ["post", "/odata/Roles({Id})/UiPath.Server.Configuration.OData.SetUsers"]
		}[action]
	}

	static Sessions(action) {
		return {
			GetAll: ["get", "/odata/Sessions"]
		}[action]
	}

	static Stats(action) {
		return {
			GetCountStats: ["get", "/api/Stats/GetCountStats"],
			GetSessionsStats: ["get", "/api/Stats/GetSessionsStats"],
			GetJobsStats: ["get", "/api/Stats/GetJobsStats"],
			Stats: ["get", "/api/Stats"]
		}[action]
	}

	static Tenants(action) {
		return {
			GetAll: ["get", "/odata/Tenants"],
			GetOne: ["get", "/odata/Tenants({Id})"],
			Create: ["post", "/odata/Tenants"],
			Delete: ["delete", "/odata/Tenants({Id})"],
			Edit: ["put", "/odata/Tenants({Id})"],
			SetActive: ["post", "/odata/Tenants/UiPath.Server.Configuration.OData.SetActive"]
		}[action]
	}

	static UserLoginAttempts(action) {
		return {
			GetOne: ["get", "/odata/UserLoginAttempts({Id})"]
		}[action]
	}

	static Users(action) {
		return {
			GetAll: ["get", "/odata/Users"],
			GetOne: ["get", "/odata/Users({Id})"],
			Create: ["post", "/odata/Users"],
			Delete: ["delete", "/odata/Users({Id})"],
			Edit: ["put", "/odata/Users({Id})"],
			GetCurrentPermissions: ["get", "/odata/Users/UiPath.Server.Configuration.OData.GetCurrentPermissions()"],
			GetCurrentUser: ["get", "/odata/Users/UiPath.Server.Configuration.OData.GetCurrentUser()"],
			ToggleRole: ["post", "/odata/Users({Id})/UiPath.Server.Configuration.OData.ToggleRole"],
			ToggleOrganizationUnit: ["post", "/odata/Users({Id})/UiPath.Server.Configuration.OData.ToggleOrganizationUnit"],
			ImportUsers: ["post", "/odata/Users/UiPath.Server.Configuration.OData.ImportUsers"],
			ChangePassword: ["post", "/odata/Users({Id})/UiPath.Server.Configuration.OData.ChangePassword"],
			SetActive: ["post", "/odata/Users({Id})/UiPath.Server.Configuration.OData.SetActive"],
			ChangeCulture: ["post", "/odata/Users/UiPath.Server.Configuration.OData.ChangeCulture"],
			UpdatePassword: ["post", "/odata/Users/UiPath.Server.Configuration.OData.UpdatePassword"]
		}[action]
	}
}

module.exports = Api;