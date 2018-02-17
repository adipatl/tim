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
        checkCookie();
    }
};

const redirectUrl =
  "http://data-capture.financial.thomsonreuters.com/go?iv=384s5oqum0qd6";

function redirect() {

  const employeeId = document.getElementById("employeeId").value;
  const email = document.getElementById("email").value;
  createCookie("employeeId", employeeId, 30);
  var redirect = redirectTo(email, employeeId);
}

function redirectTo(email, employeeId) {
  var url = redirectUrl;
  if (email && email.length > 0) {
      url += "&q1=" + email;
  }

  if (employeeId && employeeId.length > 0) {
    url += "&q2=" + employeeId;
  }

  if (url.length > redirectUrl.length) {
      //window.location.href = url;
      window.open(url, '_system');
      return true;
  }
  return false;
}

function pickContact() {

    function fillEmail(email) {
        document.getElementById("email").value = email;
    }
    navigator.contacts.pickContact(function(contact){
        if (contact.emails.length === 1) {
            fillEmail(contact.emails[0].value);
        }
        else if (contact.emails.length > 1) {
            var emailList = [];
            for (var i = 0; i < contact.emails.length; ++i) {
                emailList.push(contact.emails[i].value);
            }

            function onSelectedEmail(buttonIndex) {
                fillEmail(emailList[buttonIndex].value);
            }

            navigator.notification.confirm(
                'Please select email for this customer!', // message
                onSelectedEmail,            // callback to invoke with index of button pressed
                'Select email',           // title
                emailList     // buttonLabels
            );
        }
        else {
            navigator.notification.alert('This contact has no email', null);
        }

        checkValid();
    },function(err){
        console.log('Error: ' + err);
    });
}

function checkValid() {
  const employeeId = document.getElementById("employeeId").value;
  const email = document.getElementById("email").value;

  document.getElementById("button").disabled = employeeId.length <=0 || email.length <= 0;
}

function checkCookie() {
  document.getElementById("employeeId").value = readCookie("employeeId");

}

// cookies utils
// https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
function createCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name, "", -1);
}
