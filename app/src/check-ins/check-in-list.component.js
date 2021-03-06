(function () {
    'use strict';

    angular
        .module('checkIns')
        .component('msCheckInList', {
            templateUrl: "src/check-ins/check-in-list.html",
            controller: 'CheckInListController',
            bindings: {
                checkIns: '<msCheckIns',
                showCustomer: '=?msShowCustomer',
                onDelete: '&?msOnDelete',
                onEdit: '&?msOnEdit'
            }
        });

})();