(function(){
	var app = angular.module('arevea');
	app.factory('myTeamFactory',['$resource', 'request',
		function($resource, request){
		return{
			team: $resource(request.setup.url('getTeams'),{},{
				getList: {
					method: 'POST',
					transformResponse: function(data, header){
						return request.parse(data);
					}
				}
			}),
			createTeam: $resource(request.setup.url('createTeam'),{},{
				save: {
					method: 'POST',
					transformResponse: function(data, header){
						return request.parse(data);
					}
				}
			}),
			updateTeam: $resource(request.setup.url('updateTeam'),{},{
				save: {
					method: 'POST',
					transformResponse: function(data, header){
						return request.parse(data);
					}
				}
			}),
			deleteTeam: $resource(request.setup.url('deleteTeam'),{},{
				delete: {
					method: 'POST',
					transformResponse: function(data, header){
						return request.parse(data);
					}
				}
			}),
			vendorCategories: $resource(request.setup.url('vendorServiceCategories'),{},{
				get: {
					method: 'POST',
					transformResponse: function(data, header){
						return request.parse(data);
					}
				}
			}),
			vendorGetLocations: $resource(request.setup.url('vendorGetLocations'),{},{
				get: {
					method: 'POST',
					transformResponse: function(data, header){
						return request.parse(data);
					}
				}
			}),
			usersToAssignTeam: $resource(request.setup.url('getTeamMembers'),{},{
				get: {
					method: 'POST',
					transformResponse: function(data, header){
						return request.parse(data);
					}
				}
			}),
			assignTeamToUser: $resource(request.setup.url('assignTeamToUser'),{},{
				save: {
					method: 'POST',
					transformResponse: function(data, header){
						return request.parse(data);
					}
				}
			}),
			assignUserToTeam: $resource(request.setup.url('assignUserToTeam'),{},{
				save: {
					method: 'POST',
					transformResponse: function(data, header){
						return request.parse(data);
					}
				}
			}),
			deleteUserFromTeam: $resource(request.setup.url('deleteUserFromTeam'),{},{
				remove: {
					method: 'POST',
					transformResponse: function(data, header){
						return request.parse(data);
					}
				}
			}),
			teamUsersByTeamID: $resource(request.setup.url('getTeamUsersByTeamID'),{},{
				get: {
					method: 'POST',
					transformResponse: function(data, header){
						return request.parse(data);
					}
				}
			}),
			downloadTeamMemberTemplate: $resource(request.setup.url('downloadTeamMemberTemplate'),{},{
				get: {
					method: 'GET',
					transformResponse: function(data, header){
						return request.parse(data);
					}
				}
			}),
			importTeamMemberTemplate: $resource(request.setup.url('importTeamMemberTemplate'),{},{
				import: {
					method: 'POST',
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined},
					transformResponse: function(data, header){
						return request.parse(data);
					}
				}
			})
		}
	}]);
}());
