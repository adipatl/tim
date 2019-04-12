"use strict";

ons.bootstrap().service("PhoneGapService", function() {
    function getName(contact) {
        if (!contact) return null;
        if (contact.displayName && contact.displayName.length > 0) return contact.displayName;
        var name = "";
        return contact.name && (contact.name.givenName && contact.name.givenName.length > 0 && (name += contact.name.givenName), 
        contact.name.familyName && contact.name.familyName.length > 0 && (name.length > 0 && (name += " "), 
        name += contact.name.familyName)), name;
    }
    return {
        alert: function(message) {
            navigator && navigator.notification.alert(message);
        },
        pickContact: function(callback) {
            if ("function" == typeof callback) if (navigator && navigator.contacts) {
                var selectedContact = {};
                navigator.contacts.pickContact(function(contact) {
                    if (selectedContact.name = getName(contact), null === contact.emails || void 0 === contact.emails || contact.emails.length <= 0) navigator.notification.alert("This contact has no email associated"); else if (1 === contact.emails.length) selectedContact.email = contact.emails[0].value, 
                    callback(selectedContact); else if (contact.emails.length > 1) {
                        for (var emailList = [], i = 0; i < contact.emails.length; ++i) emailList.push(contact.emails[i].value);
                        navigator.notification.confirm("Please select email for this customer", function(buttonIndex) {
                            buttonIndex && buttonIndex > 0 && (selectedContact.email = contact.emails[buttonIndex - 1].value, 
                            callback(selectedContact));
                        }, "Select email", emailList);
                    }
                }, function(err) {
                    console.log("Error: " + err);
                });
            } else console.log("cordova is not loaded");
        },
        findContact: function(keyword, callback) {
            if ("function" == typeof callback) if (navigator && navigator.contacts) {
                var options = new ContactFindOptions();
                options.filter = keyword, options.multiple = !0, options.desiredFields = [ navigator.contacts.fieldType.id, navigator.contacts.fieldType.name, navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.note ];
                var searchFields = [ navigator.contacts.fieldType.name, navigator.contacts.fieldType.displayName ];
                navigator.contacts.find(searchFields, function(contacts) {
                    for (var contact = null, i = 0; i < contacts.length; i++) if (getName(contacts[i]) === keyword) {
                        contact = contacts[i];
                        break;
                    }
                    contact && callback(contact);
                }, function(error) {
                    console.log("error -" + error);
                }, options);
            } else console.log("cordova is not loaded");
        }
    };
}).service("ConfigService", function() {
    return {
        getUrl: function(id, param) {
            var contacts, employeeId = "", opportunity = "";
            param && (employeeId = param.employeeId, contacts = param.contacts, opportunity = param.opportunity);
            var url = "";
            if ("training" === id ? url = "https://refinitiv.clicktools.com/go?iv=1x1ulqgrvolxi&q1=%20%0D%0A%20&q2=" + employeeId : "meeting" === id ? url = "https://refinitiv.clicktools.com/go?iv=kak1ze2kwqnx&q1=%20%0D%0A%20&q2=" + employeeId : "opportunity" === id ? url = "https://refinitiv.clicktools.com/go?iv=1402c94g3dyou&q1=%20%0D%0A%20&q2=" + employeeId : "clientfeedback" === id ? url = "https://refinitiv.clicktools.com/go?iv=1pwennwy8weqk&q1=%20%0D%0A%20&q2=" + employeeId : "enh" === id ? url = "https://refinitiv.clicktools.com/go?iv=1jbwk8odpi4xn&q1=%20%0D%0A%20&q2=" + employeeId : "interview" === id ? url = "https://refinitiv.clicktools.com/go?iv=3tg6r154u3tgn&q1=%20%0D%0A%20&q2=" + employeeId : "pwa" === id ? url = "https://refinitiv.clicktools.com/go?iv=2tbf87xllgqrf&q6=" + employeeId : "timfeedback" === id && (url = "https://refinitiv.clicktools.com/go?iv=19idrjnh2pkf6&q1=%20%0D%0A%20&q2=" + employeeId), 
            "opportunity" === id) url = url + "&q1=" + opportunity; else if ("pwa" === id) contacts.length > 0 && (url = url + "&q5=" + contacts[0].email); else for (var i = 1; i < contacts.length + 1; ++i) url = url + "&q" + i + "=" + contacts[i - 1].email;
            return url;
        },
        getTitle: function(id) {
            return "training" === id ? "Training Event" : "meeting" === id ? "Meeting Event" : "opportunity" === id ? "Opportunity Event" : "clientfeedback" === id ? "Client Feedback" : "enh" === id ? "Enhancement" : "";
        },
        getLabelForCustomerEmailHeader: function(id) {
            return "training" === id ? "Customer email address (max 10)" : "opportunity" === id ? "Valid Opportunity name" : "Customer email address";
        },
        getLabelForEmailButton: function(id) {
            return "opportunity" === id ? "Select opportunity from contacts" : "Select e-mail from contacts";
        }
    };
}).service("ContactService", [ "PhoneGapService", function(PhoneGapService) {
    var selectedContacts = [];
    return {
        add: function(scope, item) {
            selectedContacts.push(item), scope.$apply();
        },
        remove: function(scope, index) {
            scope.carousel[index].prev({
                animation: "none"
            }), selectedContacts.splice(index, 1);
        },
        reset: function(scope) {
            selectedContacts.length = 0, scope.$apply();
        },
        selectedContacts: selectedContacts,
        pickContact: function(callback, errCallback) {
            "function" == typeof callback && PhoneGapService.pickContact(function(contact) {
                console.log(contact), callback(contact);
            });
        },
        getNotesFromOpportunity: function(scope, opportunityNotes) {
            PhoneGapService.findContact("Opportunities", function(contact) {
                for (var noteList = contact.note.split("\n"), i = 0; i < noteList.length; i++) {
                    var opportunityItem = noteList[i].trim();
                    opportunityItem.length <= 0 || opportunityNotes.push({
                        id: i + 1,
                        name: opportunityItem
                    });
                }
                scope.$apply();
            });
        }
    };
} ]).controller("MailController", [ "$scope", "ContactService", "ConfigService", function($scope, ContactService, ConfigService) {
    $scope.remove = function(index) {
        ContactService.remove($scope, index);
    }, $scope.selectedContacts = ContactService.selectedContacts, $scope.maxSupportedItem = 1, 
    this.selectedOpportunity = "", $scope.pickContact = function() {
        ContactService.pickContact(function(contact) {
            ContactService.add($scope, contact);
        });
    }, $scope.submit = function() {
        var storage = window.localStorage;
        console.log(storage.getItem("tim-employeeId"));
        var content = document.getElementById("content"), url = ConfigService.getUrl(content.topPage.data.content.nextPageId, {
            employeeId: storage.getItem("tim-employeeId"),
            contacts: ContactService.selectedContacts,
            opportunity: this.mailController.selectedOpportunity
        });
        window.open(url, "_system");
    }, $scope.goBack = function() {
        document.querySelector("#myNavigator").resetToPage("login.html");
    };
    this.init = function(event) {
        console.log("init - mail");
        var content = document.getElementById("content");
        console.log("data: " + JSON.stringify(content.topPage.data)), $scope.maxSupportedItem = 1, 
        content.topPage.data.content.maxItem && ($scope.maxSupportedItem = parseInt(content.topPage.data.content.maxItem)), 
        $scope.opportunityNotes = [], ContactService.reset($scope);
    }, this.initOpportunity = function() {
        console.log("init - Oppor"), ContactService.getNotesFromOpportunity($scope, $scope.opportunityNotes);
    }, $scope.getTitleLabel = function() {
        var param = document.getElementById("content").topPage.data.content.nextPageId;
        return ConfigService.getTitle(param);
    }, $scope.getCustomerEmailHeader = function() {
        var param = document.getElementById("content").topPage.data.content.nextPageId;
        return ConfigService.getLabelForCustomerEmailHeader(param);
    }, $scope.getSelectEmailButtonLabel = function() {
        var param = document.getElementById("content").topPage.data.content.nextPageId;
        return ConfigService.getLabelForEmailButton(param);
    };
} ]), document.addEventListener("init", function(event) {
    var name, writeToCache = function(name, value) {
        window.localStorage.setItem(name, value);
    }, goToPage = function(page) {
        console.log("go to " + page), document.querySelector("#myNavigator").pushPage(page);
    }, resetToPage = function(page) {
        console.log("reset to " + page), document.querySelector("#myNavigator").resetToPage(page);
    }, cacheEmployeeId = (name = "tim-employeeId", window.localStorage.getItem(name)), myNavigator = document.querySelector("#myNavigator");
    myNavigator && myNavigator.topPage && (myNavigator.topPage.onDeviceBackButton = function(event) {
        resetToPage("login.html");
    });
    var contentNav = document.querySelector("#content");
    contentNav && contentNav.topPage && (contentNav.topPage.onDeviceBackButton = function(event) {
        resetToPage("login.html");
    });
    var page = event.target;
    if ("login" === page.id) {
        var loggingInElement = document.getElementById("loggingInElement");
        if ("string" == typeof cacheEmployeeId && cacheEmployeeId.length > 0) return loggingInElement.show(), 
        void setTimeout(function() {
            goToPage("landing.html");
        }, 100);
        var employeeIdTextBox = document.getElementById("employee-id"), next = document.getElementById("next");
        employeeIdTextBox.onkeyup = function(ev) {
            next.disabled = employeeIdTextBox.value.length <= 0;
        }, next.onclick = function(ev) {
            writeToCache("tim-employeeId", employeeIdTextBox.value), loggingInElement.show(), 
            goToPage("landing.html");
        };
    } else {
        if (page.id.startsWith("content")) {
            var rootMenu = document.getElementById("menu"), menuButton = document.getElementById("menu-button"), homeMenu = document.getElementById("menu-home"), resetMenu = document.getElementById("menu-reset");
            menuButton && (menuButton.onclick = function(ev) {
                rootMenu.open();
            }), homeMenu && (homeMenu.onclick = function(ev) {
                resetToPage("login.html");
            }), resetMenu && (resetMenu.onclick = function(ev) {
                writeToCache("tim-employeeId", ""), resetToPage("login.html");
            });
        }
        var typeSelectionHandler = function(ev) {
            if ("navigate" !== ev.srcElement.dataset.nextPage) {
                var nextPage = ev.srcElement.dataset.nextPage + ".html", data = ev.srcElement.dataset, content = document.getElementById("content"), menu = document.getElementById("menu"), options = {
                    data: {
                        content: data
                    }
                };
                content.resetToPage(nextPage, options).then(menu.close.bind(menu));
            } else {
                var url = "https://survey.clicktools.com/app/survey/go.jsp?iv=323zmt2kpsnc1&q2=" + window.localStorage.getItem("tim-employeeId");
                window.open(url, "_system");
            }
        };
        if ("content-home" === page.id) for (var eventTypes = document.getElementsByTagName("ons-button"), i = 0; i < eventTypes.length; i++) eventTypes[i].onclick = typeSelectionHandler;
    }
});