const redirectUrl =
  "http://data-capture.financial.thomsonreuters.com/go?iv=384s5oqum0qd6&q2=";

function redirect() {
  document.getElementById("button").style.display = "none";
  document.getElementById("swirl").style.display = "block";
  const employeeId = document.getElementById("employeeId").value;
  createCookie("employeeId", employeeId, 365);
  window.location.href = redirectUrl + employeeId;
}

function checkCookie() {
  const employeeId = readCookie("employeeId");
  if (employeeId) {
    document.getElementById("employeeId").value = employeeId;
    document.getElementById("button").style.display = "none";
    document.getElementById("swirl").style.display = "block";
    window.location.href = redirectUrl + employeeId;
  }
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
