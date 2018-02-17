var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    isPhoneGap: function() {
        return document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        if (this.isPhoneGap()) {
            console.log('Loaded under Phonegap');
            document.addEventListener('deviceready', this.onDeviceReady, false);
        }
        else {
            console.log('Loaded under Web Browser');
            this.onDeviceReady();
        }
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        checkCache();
    }
};

const redirectUrl =
  "http://data-capture.financial.thomsonreuters.com/go?iv=384s5oqum0qd6";

function redirect() {

  const employeeId = document.getElementById("employeeId").value;
  const email = document.getElementById("email").value;
  writeToCache("employeeId", employeeId);
  redirectTo(email, employeeId);
}

function redirectTo(email, employeeId) {
  var url = redirectUrl;
  if (email && email.length > 0) {
      url += "&q1=" + email;
  }

  if (employeeId && employeeId.length > 0) {
    url += "&q2=" + employeeId;
  }

  window.open(url, '_system');
}

function pickContact() {

    function fillEmail(email) {
        document.getElementById("email").value = email;
    }
    navigator.contacts.pickContact(function(contact){
        if (contact.emails === null || contact.emails === undefined) {
            navigator.notification.alert('This contact has no email', fillEmail(""));
        }
        else if (contact.emails.length === 1) {
            fillEmail(contact.emails[0].value);
        }
        else if (contact.emails.length > 1) {
            var emailList = [];
            for (var i = 0; i < contact.emails.length; ++i) {
                emailList.push(contact.emails[i].value);
            }

            function onSelectedEmail(buttonIndex) {
                if (buttonIndex === undefined || buttonIndex <= 0)
                    fillEmail(-1);
                else
                    fillEmail(emailList[buttonIndex-1]);
            }

            navigator.notification.confirm(
                'Please select email for this customer!', // message
                onSelectedEmail,            // callback to invoke with index of button pressed
                'Select email',           // title
                emailList     // buttonLabels
            );
        }
    },function(err){
        console.log('Error: ' + err);
    });
}

function checkCache() {
  var employeeId = readFromCache("employeeId");
  if (employeeId === null || employeeId === undefined || employeeId.length <= 0)
      return;

  document.getElementById("employeeId").value = employeeId;
}

function writeToCache(name, value) {
    var storage = window.localStorage;
    storage.setItem(name, value); // Pass a key name and its value to add or update that key.
}

function readFromCache(name) {
    var storage = window.localStorage;
    return storage.getItem(name); // Pass a key name and its value to add or update that key.
}
