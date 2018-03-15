

var byId = function(id) { return document.getElementById(id);};


function replace_all(original, find, replace) {
    return original.split(find).join(replace);
}

function mustasche(original, data) {
    var str = original;
    for (var i in data) {
        str = replace_all(str, "{" + i + "}", data[i]);
    }
    return str;
}


function createElementFromTemplate(template, data) {
    var str = mustasche(template, data);
    var t = document.createElement("template"); //A template can have any dom element as a child
    t.innerHTML = str.trim();
    return t.content.firstChild;
}


var input = byId("input");
var processDiv = byId("processDiv");
var output = byId("output");

input.addEventListener("keyup", function() {
    //console.log(input.value);
    triggerSearch();
});


var timer = -1;

var lastSearch = "";

function triggerSearch() {
    if (lastSearch == input.value) {
        return;
    }
    lastSearch = input.value;

    output.innerHTML = "söker...";
    clearTimeout(timer);

    if (input.value === "") {
        output.innerHTML = "";
        return;
    }
    timer = -1;
    timer = setTimeout(function() {
        doSearch();
    }, 500);
}

var resultTemplate = `
<tr>
    <td>
        <a title="Tryck för att välja språk" href="#{lang}">
        {lang}</a>
        </td><td>
        <a title="Länk till wikipedia" href={url}>{name}</a>
    </td>
</tr>
`;

var post = null;

window.onhashchange = function() {
    doSearch();
}

function doSearch() {
    if (post) {
        post.abort();
    }
    post = $.post("access.php",{
        url: "https://sv.wikipedia.org/wiki/" + input.value
    })
    .done(function(data) {
        output.innerHTML = "";
        post = null
        // console.log(data);
        processDiv.innerHTML = data;
        // languageBody = processDiv.getElementsByClassName("body")[3];

        languageLinks = processDiv.getElementsByClassName("interlanguage-link-target");
        let language = decodeURIComponent(window.location.hash.substr(1));

        for (var i in languageLinks) {
            let link = languageLinks[i];

            let url = decodeURIComponent( languageLinks[i].href);
            // console.log ("url: " + url);
            let d = {
                url: url,
                lang: link.innerHTML,
                name: url.substr(url.lastIndexOf("/") + 1)
            }

            if (d.name == "undefined") {
                continue;
            }

            if (language && language != d.lang) {
                continue;
            }

            let div = createElementFromTemplate(resultTemplate, d);

            output.appendChild(div);
        }

    })
    .fail(function(data) {
        output.innerHTML = "Kunde inte hitta wiki-sida ☹ ";
        post = null;
    });
}