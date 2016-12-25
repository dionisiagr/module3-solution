(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "http://davids-restaurant.herokuapp.com")
.directive('foundItems', ItemsListDirective);


function ItemsListDirective() {
  var ddo = {
    templateUrl: 'resultsList.html',
    scope: {
      items: '<',
      myTitle: '@title',
      onRemove: '&'
    },
    controller: NarrowItDownDirectiveController,
    controllerAs: 'ctrl',
    bindToController: true
  };

  return ddo;
}





NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var ctrl = this;
  ctrl.items = [];
  ctrl.searchTerm = "";
  ctrl.foundItems = function () {
    var promise = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);

    promise.then(function (response) {
      ctrl.items = response;
    })
    .catch(function (error) {
      console.log(error);
    });    
  };

  ctrl.removeItem = function(index) {
      ctrl.items.splice(index, 1);
  };

}


MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService($http, ApiBasePath) {
  var service = this;

       service.getMatchedMenuItems = function(searchTerm) {
         return $http({
           method: "GET",
           url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
         })
         .then(function(response) {

           // process all results
           var items = response.data.menu_items;
           var foundItems = [];

           for (var i = 0; i < items.length; i++) {

             if (items[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
               foundItems.push(items[i]);
             }
           }
           return foundItems;
         });

       };

}

function NarrowItDownDirectiveController() {
  var ctrl = this;

  ctrl.isEmpty = function() {
    return ctrl.items.length === 0;
  }
}

})();
