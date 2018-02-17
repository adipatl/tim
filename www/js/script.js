const redirectUrl =
  "http://data-capture.financial.thomsonreuters.com/go?iv=384s5oqum0qd6";

function redirect() {

  const employeeId = document.getElementById("employeeId").value;
  const email = document.getElementById("email").value;
  createCookie("employeeId", employeeId, 30);
  var redirect = redirectTo(email, employeeId);
  if (redirect) {
      document.getElementById("button").style.display = "none";
      document.getElementById("swirl").style.display = "block";
  }
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
      window.location.href = url;
      return true;
  }
  return false;
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
