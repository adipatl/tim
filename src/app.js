"use strict";

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
        document.querySelector('#myNavigator').pushPage(page);
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
    else if (page.id === 'landing') {
        console.log('landing page');
    }
});

