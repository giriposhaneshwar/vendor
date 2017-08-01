(function(){
	var app = angular.module('arevea');
	app.factory('teamMemberFactory',['$resource', 'request',
		function($resource, request){
		return{
			teamMembers: $resource(request.setup.url('getTeamMembers'),{},{
				getList: {
					method: 'POST',
					transformResponse: function(data, header){
						return request.parse(data);
					}
				}
			}),
			createTeamMember: $resource(request.setup.url('createTeamMember'),{},{
				save: {
					method: 'POST',
					transformResponse: function(data, header){
						return request.parse(data);
					}
				}
			}),
			deleteTeamMember: $resource(request.setup.url('deleteTeamMember'),{},{
				delete: {
					method: 'POST',
					transformResponse: function(data, header){
						return request.parse(data);
					}
				}
			}),
			updateTeamMember: $resource(request.setup.url('updateTeamMember'),{},{
				save: {
					method: 'POST',
					transformResponse: function(data, header){
						return request.parse(data);
					}
				}
			})
		}
	}]);
}());
