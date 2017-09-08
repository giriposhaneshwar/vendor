(function () {
    var app = angular.module('arevea');
    app.factory('myBookingFactory', ['$resource', 'request',
        function ($resource, request) {
            return{
                teamsByCatAndLoc: $resource(request.setup.url('getTeamsByCatAndLoc'), {}, {
                    getList: {
                        method: 'POST',
                        transformResponse: function (data, header) {
                            return request.parse(data);
                        }
                    }
                }),
                availableUsersByTeamID: $resource(request.setup.url('getAvailableUsersByTeamID'), {}, {
                    getList: {
                        method: 'POST',
                        transformResponse: function (data, header) {
                            return request.parse(data);
                        }
                    }
                }),
                assignUsersToBooking: $resource(request.setup.url('assignUsersToBooking'), {}, {
                    save: {
                        method: 'POST',
                        transformResponse: function (data, header) {
                            return request.parse(data);
                        }
                    }
                }),
                assignedTeamUsersForBooking: $resource(request.setup.url('getAssignedTeamUsersForBooking'), {}, {
                    getList: {
                        method: 'POST',
                        transformResponse: function (data, header) {
                            return request.parse(data);
                        }
                    }
                }),
                removeFromVendorAssignment: $resource(request.setup.url('removeFromVendorAssignment'), {}, {
                    remove: {
                        method: 'POST',
                        transformResponse: function (data, header) {
                            return request.parse(data);
                        }
                    }
                })
            }
        }]);
}());
