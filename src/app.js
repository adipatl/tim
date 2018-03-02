"use strict";

ons.bootstrap()
    .service('PhoneGapService', function() {

        function getName(contact) {
            if (!contact)
                return null;

            if (contact.displayName && contact.displayName.length > 0)
                return contact.displayName;

            var name = '';
            if (contact.name) {
                if (contact.name.givenName && contact.name.givenName.length > 0) {
                    name += contact.name.givenName;
                }

                if (contact.name.familyName && contact.name.familyName.length > 0) {
                    if (name.length > 0)
                        name += ' ';

                    name += contact.name.familyName;
                }
            }
            return name;
        }

        return {
            alert: function(message) {
                if (!navigator)
                    return;

                navigator.notification.alert(message);
            },
            pickContact: function(callback) {
                if (typeof callback !== 'function')
                    return;

                if (!navigator || !navigator.contacts) {
                    console.log('cordova is not loaded');
                    return;
                }

                var selectedContact = {};
                navigator.contacts.pickContact(function(contact){
                    selectedContact.name = getName(contact);
                    if (contact.emails) {
                        if (contact.emails.length === 1) {
                            selectedContact.email = contact.emails[0].value;
                            callback(selectedContact);
                        }
                        else if (contact.emails.length > 1) {
                            var emailList = [];
                            for (var i = 0; i < contact.emails.length; ++i) {
                                emailList.push(contact.emails[i].value);
                            }

                            navigator.notification.confirm(
                                'Please select email for this customer', // message
                                function(buttonIndex) {
                                    if (buttonIndex && buttonIndex > 0) {
                                        selectedContact.email = contact.emails[buttonIndex - 1].value;
                                        callback(selectedContact);
                                    }
                                },            // callback to invoke with index of button pressed
                                'Select email',           // title
                                emailList     // buttonLabels
                            );
                        }
                    }

                },function(err){
                    console.log('Error: ' + err);
                });
            }
        }
    })
    .service('ConfigService', function(){
        return {
            getUrl: function (id, param) {
                var employeeId = '';
                if (param) {
                    employeeId = param.employeeId;
                }

                if (id === 'training') {
                    return 'http://data-capture.financial.thomsonreuters.com/go?iv=t4cqtyisrcp9&q11=' + employeeId;
                }
                if (id === 'meeting') {
                    return 'http://data-capture.financial.thomsonreuters.com/go?iv=384s5oqum0qd6&q2=' + employeeId;
                }
                if (id === 'opportunity') {
                    return 'http://data-capture.financial.thomsonreuters.com/go?iv=2bsqu91m0xhbo';
                }
                if (id === 'clientfeedback') {
                    return 'http://data-capture.financial.thomsonreuters.com/go?iv=1s5p8l5gk7w22&q2=' + employeeId;
                }
                if (id === 'contentenh') {
                    return 'http://data-capture.financial.thomsonreuters.com/go?iv=1wi4x8k9kn4z2&q2=' + employeeId;
                }
                if (id === 'productenh') {
                    return 'http://data-capture.financial.thomsonreuters.com/go?iv=3hh23k27tplyw&q2=' + employeeId;
                }
                return '';
            },
            getTitle: function(id) {
                if (id === 'training') {
                    return 'Training Event';
                }
                if (id === 'meeting') {
                    return 'Meeting Event';
                }
                if (id === 'opportunity') {
                    return 'Opportunity Event';
                }
                if (id === 'clientfeedback') {
                    return 'Client Feedback';
                }
                if (id === 'contentenh') {
                    return 'Content Enhancement';
                }
                if (id === 'productenh') {
                    return 'Product Enhancement';
                }
                return '';
            }
        }
    })
    .service('ContactService', ['PhoneGapService', function(PhoneGapService) {
        var defaultItems = [];
        return {
            add: function(scope, item) {
                defaultItems.push(item);
                scope.$apply();
            },
            remove: function(scope, index) {
                scope.carousel[index].prev({animation: 'none'});
                defaultItems.splice(index, 1);
            },
            reset: function(scope) {
                defaultItems.length = 0;
                scope.$apply();
            },
            myArray: defaultItems,
            pickContact: function(callback, errCallback) {
                if (typeof callback !== 'function')
                    return;

                PhoneGapService.pickContact(function(contact) {
                    console.log(contact);
                    callback(contact);
                });
            }
        }
    }])
    .controller('MailController', ['$scope', 'ContactService', 'ConfigService',
    function($scope, ContactService, ConfigService) {
        $scope.remove = function(index) {
            ContactService.remove($scope, index);
        };

        $scope.myArray = ContactService.myArray;
        $scope.maxSupportedItem = 1;

        $scope.pickContact = function() {
            ContactService.pickContact(function(contact) {
                ContactService.add($scope, contact);
            });
        };

        $scope.submit = function() {

            var storage = window.localStorage;
            console.log(storage.getItem('tim-employeeId'));

            var content = document.getElementById('content');
            var url = ConfigService.getUrl(content.topPage.data.content.nextPageId,
                {
                    employeeId: storage.getItem('tim-employeeId')
                });

            window.open(url, '_system');
        };

        var model = this;

        model.init = function (event) {
            console.log('init - mail');

            var content = document.getElementById('content');
            console.log('data: ' + JSON.stringify(content.topPage.data));

            $scope.maxSupportedItem = 1;
            if (content.topPage.data.content.maxItem)
                $scope.maxSupportedItem = parseInt(content.topPage.data.content.maxItem);

            ContactService.reset($scope);
        };

        $scope.getTitleLabel = function() {
            var content = document.getElementById('content');
            var param = content.topPage.data.content.nextPageId;
            return ConfigService.getTitle(param);
        }

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
            }, 100);
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
            var data = ev.srcElement.dataset;
            var content = document.getElementById('content');
            var menu = document.getElementById('menu');

            var options = {
                data: {
                    content: data
                }
            };
            content.resetToPage(nextPage, options).then(menu.close.bind(menu));
        };

        if (page.id === 'content-home') {
            var eventTypes = document.getElementsByTagName('ons-button');
            for (var i = 0; i < eventTypes.length; i++) {
                eventTypes[i].onclick = typeSelectionHandler;
            }
        }
    }
});

