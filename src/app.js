"use strict";

//ons.disableAutoStyling();
//ons.platform.select('ios');
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
                    if (contact.emails === null || contact.emails === undefined || contact.emails.length <= 0) {
                        navigator.notification.alert('This contact has no email associated');
                        return;
                    }

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

                },function(err){
                    console.log('Error: ' + err);
                });
            },
            findContact: function(keyword, callback) {
                if (typeof callback !== 'function')
                    return;

                if (!navigator || !navigator.contacts) {
                    console.log('cordova is not loaded');
                    return;
                }

                var options = new ContactFindOptions();
                options.filter = keyword;
                options.multiple = true;
                options.desiredFields = [navigator.contacts.fieldType.id, navigator.contacts.fieldType.name, navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.note];

                var searchFields       = [navigator.contacts.fieldType.name, navigator.contacts.fieldType.displayName];

                navigator.contacts.find(searchFields,
                    function(contacts) {
                        var contact = null;
                        for (var i = 0; i < contacts.length; i++) {
                            if (getName(contacts[i]) === keyword) {
                                contact = contacts[i];
                                break;
                            }
                        }

                        if (contact)
                            callback(contact);
                    },
                    function(error) {
                        console.log('error -' + error);
                    },
                    options
                );
            }
        }
    })
    .service('ConfigService', function(){
        return {
            getUrl: function (id, param) {
                var employeeId = '';
                var contacts;
                var opportunity = '';
                if (param) {
                    employeeId = param.employeeId;
                    contacts = param.contacts;
                    opportunity = param.opportunity;
                }

                var url = '';
                if (id === 'training') {
                    url = 'http://data-capture.financial.thomsonreuters.com/go?iv=t4cqtyisrcp9&q11=' + employeeId;
                }
                else if (id === 'meeting') {
                    url = 'http://data-capture.financial.thomsonreuters.com/go?iv=384s5oqum0qd6&q2=' + employeeId;
                }
                else if (id === 'opportunity') {
                    url = 'https://survey.clicktools.com/app/survey/go.jsp?iv=2bsqu91m0xhbo&q2=' + employeeId;
                }
                else if (id === 'clientfeedback') {
                    url = 'http://data-capture.financial.thomsonreuters.com/go?iv=1s5p8l5gk7w22&q2=' + employeeId;
                }
                else if (id === 'contentenh') {
                    url = 'http://data-capture.financial.thomsonreuters.com/go?iv=1wi4x8k9kn4z2&q2=' + employeeId;
                }
                else if (id === 'productenh') {
                    url = 'http://data-capture.financial.thomsonreuters.com/go?iv=3hh23k27tplyw&q2=' + employeeId;
                }

                if (id === 'opportunity') {
                    url = url + '&q1=' + opportunity;
                }
                else {
                    for (var i = 1; i < contacts.length + 1; ++i ) {
                        url = url + '&q' + i + '=' + contacts[i-1].email;
                    }
                }

                return url;
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
            },
            getLabelForCustomerEmailHeader: function(id) {
                if (id === 'training') {
                    return 'Customer email address (max 10)';
                }

                if (id === 'opportunity') {
                    return 'Valid Opportunity name';
                }
                return 'Customer email address';
            },
            getLabelForEmailButton: function(id) {
                if (id === 'opportunity') {
                    return 'Select opportunity from contacts';
                }
                return 'Select e-mail from contacts';
            }
        }
    })
    .service('ContactService', ['PhoneGapService', function(PhoneGapService) {
        var selectedContacts = [];
        return {
            add: function(scope, item) {
                selectedContacts.push(item);
                scope.$apply();
            },
            remove: function(scope, index) {
                scope.carousel[index].prev({animation: 'none'});
                selectedContacts.splice(index, 1);
            },
            reset: function(scope) {
                selectedContacts.length = 0;
                scope.$apply();
            },
            selectedContacts: selectedContacts,
            pickContact: function(callback, errCallback) {
                if (typeof callback !== 'function')
                    return;

                PhoneGapService.pickContact(function(contact) {
                    console.log(contact);
                    callback(contact);
                });
            },
            getNotesFromOpportunity: function (scope, opportunityNotes) {
                PhoneGapService.findContact('Opportunities', function(contact){
                    var noteList = contact.note.split('\n');
                    for (var i = 0; i < noteList.length; i++) {
                        opportunityNotes.push({
                            id: i+1,
                            name: noteList[i]
                        })
                    }
                    scope.$apply();
                });
            }
        }
    }])
    .controller('MailController', ['$scope', 'ContactService', 'ConfigService',
    function($scope, ContactService, ConfigService) {
        $scope.remove = function(index) {
            ContactService.remove($scope, index);
        };

        $scope.selectedContacts = ContactService.selectedContacts;
        $scope.maxSupportedItem = 1;
        this.selectedOpportunity = '';

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
                    employeeId: storage.getItem('tim-employeeId'),
                    contacts: ContactService.selectedContacts,
                    opportunity: this.mailController.selectedOpportunity
                });

            window.open(url, '_system');
        };

        $scope.goBack = function() {

            document.querySelector('#myNavigator').resetToPage('login.html');
        };

        var model = this;

        model.init = function (event) {
            console.log('init - mail');

            var content = document.getElementById('content');
            console.log('data: ' + JSON.stringify(content.topPage.data));

            $scope.maxSupportedItem = 1;
            if (content.topPage.data.content.maxItem)
                $scope.maxSupportedItem = parseInt(content.topPage.data.content.maxItem);

            $scope.opportunityNotes = [];
            ContactService.reset($scope);
        };

        model.initOpportunity = function () {
            console.log('init - Oppor');

            ContactService.getNotesFromOpportunity($scope, $scope.opportunityNotes);
        };

        $scope.getTitleLabel = function() {
            var content = document.getElementById('content');
            var param = content.topPage.data.content.nextPageId;
            return ConfigService.getTitle(param);
        };

        $scope.getCustomerEmailHeader = function() {
            var content = document.getElementById('content');
            var param = content.topPage.data.content.nextPageId;
            return ConfigService.getLabelForCustomerEmailHeader(param);
        };

        $scope.getSelectEmailButtonLabel = function() {
            var content = document.getElementById('content');
            var param = content.topPage.data.content.nextPageId;
            return ConfigService.getLabelForEmailButton(param);
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

    var myNavigator = document.querySelector('#myNavigator');
    if (myNavigator && myNavigator.topPage)
        myNavigator.topPage.onDeviceBackButton = function(event) {
            resetToPage('login.html');
        };

    var contentNav = document.querySelector('#content');
    if (contentNav && contentNav.topPage)
        contentNav.topPage.onDeviceBackButton = function(event) {
            resetToPage('login.html');
        };

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