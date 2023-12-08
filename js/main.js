document.addEventListener("DOMContentLoaded", function() {
    var headerElement = document.getElementById("header");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            headerElement.innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", "header.html", true);
    xhttp.send();
});
