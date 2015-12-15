var theUrl = "https://api.github.com/repos/meisolsson/Haxxball/commits"
var xmlHttp = new XMLHttpRequest();
xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
xmlHttp.send( null );

var json = JSON.parse(xmlHttp.responseText)

document.getElementById("github_ref").innerHTML = json[0].sha
document.getElementById("github_ref").href = json[0].html_url