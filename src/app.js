"use strict";

ons.bootstrap()
    .controller('MultipleEmailController', ['$scope', function($scope) {
        console.log('multiple email controller loaded');

    }])
    .controller('SingleEmailController', ['$scope', function($scope) {
        console.log('single email controller loaded');

    }])
    .controller('EmailController',  ['$scope', function($scope) {
        $scope.remove = function(index) {
            $scope.carousel[index].prev({animation: 'none'});
            $scope.myArray.splice(index, 1);
        };

        $scope.myArray = [
            { name: "Adipat L", email: "adipatl.se@gmail.com" },
            { name: "Adipat L", email: "adipatl.se@gmail.com" },
            { name: "Adipat L", email: "adipatl.se@gmail.com" },
            { name: "Adipat L", email: "adipatl.se@gmail.com" },
            { name: "Adipat L", email: "adipatl.se@gmail.com" },
            { name: "Adipat L", email: "adipatl.se@gmail.com" },
            { name: "Adipat L", email: "adipatl.se@gmail.com" },
            { name: "Adipat L", email: "adipatl.se@gmail.com" },
            { name: "Adipat L", email: "adipatl.se@gmail.com" }
        ];
    }]);

document.addEventListener('init', function(event){

    var employeeCacheName = 'tim-employeeId';
    var writeToCache = function(name, value) {
        var storage = window.localStorage;
        storage.setItem(name, value);
    };

    var readFromCache = function(name) {
        var storage = window.localStorage;
        return storage.getItem(name);
    };

    var goToPage = function(page) {
        console.log('go to ' + page);
        document.querySelector('#myNavigator').pushPage(page);
    };

    var resetToPage = function(page) {
        console.log('reset to ' + page);
        document.querySelector('#myNavigator').resetToPage(page);
    };

    var cacheEmployeeId = readFromCache(employeeCacheName);

    var page = event.target;
    if (page.id === 'login') {
        // handle the login page

        var loggingInElement = document.getElementById('loggingInElement');

        if (typeof cacheEmployeeId === 'string' && cacheEmployeeId.length > 0) {
            loggingInElement.show();
            setTimeout(function() {
                goToPage('landing.html');
            }, 1000);
            return;
        }

        var employeeIdTextBox = document.getElementById('employee-id');
        var next = document.getElementById('next');

        employeeIdTextBox.onkeyup = function (ev) {
            next.disabled = employeeIdTextBox.value.length <= 0;
        };

        next.onclick = function (ev) {
            writeToCache(employeeCacheName, employeeIdTextBox.value);
            loggingInElement.show();
            goToPage('landing.html');
        }
    }
    else {

        if (page.id.startsWith('content')) {
            var rootMenu = document.getElementById('menu');
            var menuButton = document.getElementById('menu-button');
            var homeMenu = document.getElementById('menu-home');
            var resetMenu = document.getElementById('menu-reset');

            if (menuButton)
                menuButton.onclick = function (ev) {
                    rootMenu.open();
            }   ;

            if (homeMenu)
                homeMenu.onclick = function (ev) {
                    resetToPage('login.html');
                };

            if (resetMenu)
                resetMenu.onclick = function (ev) {
                    writeToCache(employeeCacheName, '');
                    resetToPage('login.html');
                }
        }

        var typeSelectionHandler = function(ev) {
            var nextPage = ev.srcElement.dataset.nextPage + '.html';
            var content = document.getElementById('content');
            var menu = document.getElementById('menu');
            content.load(nextPage).then(menu.close.bind(menu));
        };

        if (page.id === 'content-home') {
            var eventTypes = document.getElementsByTagName('ons-button');
            for (var i = 0; i < eventTypes.length; i++) {
                eventTypes[i].onclick = typeSelectionHandler;
            }
        }
    }
});

