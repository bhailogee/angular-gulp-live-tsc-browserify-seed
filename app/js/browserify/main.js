(function () {

  'use strict';

  require('angular');
  require('angular-route');
  require('angular-animate');
  require('angular-ui-router');
  require('./../component/dyna');
  var mainCtrl = require('./../controllers/mainctrl');

    angular.module('SampleApp', ['ngRoute', 'ngAnimate', 'ui.router', 'dyna'])
  .config([
    '$locationProvider',
    '$routeProvider',
    '$stateProvider',
    'statesProvider',
    function ($locationProvider, $routeProvider, $stateProvider, statesProvider) {
        $locationProvider.hashPrefix('!');
        statesProvider.$get().states.forEach(function (_s) {
            $stateProvider.state(_s);
        });
    }
  ])

  //Load controller
  .controller('MainController', ['$scope', mainCtrl]);

}());