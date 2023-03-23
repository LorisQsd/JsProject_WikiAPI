// API ENDPOINT : `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}`

const form = document.querySelector("form");
const input = form.querySelector("#search");
const req = new XMLHttpRequest();
const method = "GET";
const url = "https://fr.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=";

form.addEventListener("submit", handleSearch);

function handleSearch(e) {
    e.preventDefault();

    errorEmpty();
    searchAPI();
};

const errorMessage = document.querySelector("#errorEmptyText");
function errorEmpty() {
    if (input.value == "") {
        errorMessage.textContent = "Veuillez renseigner le champs avant de lancer une recherche."
    } else {
        errorMessage.textContent = "";
    }
}

function searchAPI(){
    const newUrl = url + input.value;
    const displayResult = document.getElementById("result");
    req.open(method, newUrl);
    req.onreadystatechange = function (event) {

        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                const results = JSON.parse(this.responseText).query.search;

                results.forEach(result => {
                    const linkCard = document.createElement('div');
                    linkCard.classList.add('linkCard');
                    displayResult.appendChild(linkCard);

                    const newResult = document.createElement('a');
                    const linkText = document.createTextNode(result.title);
                    newResult.appendChild(linkText);
                    newResult.title = result.title;
                    newResult.href = "https://fr.wikipedia.org/?curid=" + result.pageid;
                    newResult.target = "_blank"
                    linkCard.appendChild(newResult);

                    const newResultLink = document.createElement('a');
                    const newLinkText = document.createTextNode("https://fr.wikipedia.org/?curid=" + result.pageid);
                    newResultLink.appendChild(newLinkText);
                    newResultLink.href = "https://fr.wikipedia.org/?curid=" + result.pageid;
                    newResultLink.target = "_blank";
                    linkCard.appendChild(newResultLink);

                    const newDescription = document.createElement('p');
                    const cleanedSnippet = result.snippet.replace(/<\/?span[^>]*>/g, '');
                    const descriptionText = document.createTextNode(cleanedSnippet);

                    newDescription.appendChild(descriptionText);
                    linkCard.appendChild(newDescription);
                });
            } else {
                console.log("Statut: " + this.status);
            }
        };

        if (this.readyState === XMLHttpRequest.LOADING) {

            const linkToDelete = document.querySelectorAll(".linkCard")

            linkToDelete.forEach(link => {
                displayResult.removeChild(link);
            });
        }
    };
    req.send();
};