(function () {
    'use strict';

    angular
        .module('payments')
        .factory('paymentsService', paymentsService);

    paymentsService.$inject = ['$http', 'apiUrl'];

    function paymentsService($http, apiUrl) {
        var paymentsUrl = apiUrl + '/payments';
        var requestsInProgress = 0;

        var service = {
            readById: readById,
            getPaymentsProjectionPage: getPaymentsProjectionPage,
            getPaymentsByCustomer: getPaymentsByCustomer,
            getPaymentsValidTodayByCustomer: getPaymentsValidTodayByCustomer,
            getPayerByPayment: getPayerByPayment,
            createPayment: createPayment,
            deletePayment: deletePayment,
            isRequestInProgress: isRequestInProgress
        };

        return service;

        // *********************************
        // Internal methods
        // *********************************

        function readById(id) {
            requestsInProgress++;
            return $http
                .get(paymentsUrl + '/' + id)
                .then(function (response) {
                    requestsInProgress--;
                    return response.data;
                }, function () {
                    //TODO report error;
                    requestsInProgress--;
                });
        }

        //TODO better naming - now returned page contains page (specification)
        function getPaymentsProjectionPage(projection, page) {
            requestsInProgress++;
            return $http
                //TODO sort (what if there is no timestamp in projection?)
                .get(paymentsUrl + '?projection=' + projection + '&page=' + page.number + '&size=' + page.size + '&sort=timestamp,desc')
                .then(function (response) {
                    requestsInProgress--;
                    return {
                        payments: response.data._embedded.payments,
                        page: response.data.page
                    };
                }, function () {
                    //TODO report error;
                    requestsInProgress--;
                });
        }

        function getPaymentsByCustomer(customer, pagination) {
            var params = {
                payer: customer._links.self.href,
                sort: 'timestamp,desc',
                size: pagination.size,
                page: pagination.page
            };
            requestsInProgress++;
            return $http
                .get(paymentsUrl + '/search/findByPayer/', { params: params })
                .then(function (response) {
                    requestsInProgress--;
                    return response.data._embedded.payments;
                }, function () {
                    //TODO report error
                    requestsInProgress--;
                });
        }

        function getPaymentsValidTodayByCustomer(customer) {
            var params = {
                payer: customer._links.self.href,
            };
            requestsInProgress++;
            return $http
                .get(paymentsUrl + '/search/findValidTodayByPayer/', { params: params })
                .then(function (response) {
                    requestsInProgress--;
                    return response.data._embedded.payments;
                }, function () {
                    //TODO report error
                    requestsInProgress--;
                });
        }

        function getPayerByPayment(payment) {
            requestsInProgress++;
            return $http
                .get(payment._links.payer.href)
                .then(function(response) {
                    requestsInProgress--;
                    return response.data;
                }, function() {
                    //TODO report error
                    requestsInProgress--;
                });
        }

        function createPayment(newPayment) {
            var paymentToCreate = {
                membershipStartDate: newPayment.membershipStartDate,
                payer: newPayment.payer._links.self.href,
                membership: newPayment.membership._links.self.href
            };

            requestsInProgress++;
            return $http
                .post(paymentsUrl, paymentToCreate)
                .then(function (response) {
                    requestsInProgress--;
                    return response.data;
                }, function () {
                    //TODO report error
                    requestsInProgress--;
                });
        }

        function deletePayment(payment) {
            return $http.delete(payment._links.self.href);
        }

        function isRequestInProgress() {
            return requestsInProgress != 0;
        }

    }

})();
