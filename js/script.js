const redirectUrl =
  "http://data-capture.financial.thomsonreuters.com/go?iv=384s5oqum0qd6&q2=";

function redirect() {
  document.getElementById("button").style.display = "none";
  document.getElementById("swirl").style.display = "block";
  const employeeId = document.getElementById("employeeId").value;
  window.location.href = redirectUrl + employeeId;
}
