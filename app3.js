const form = document.querySelector("form");
const input = document.querySelector("input");
const errorMsg = document.querySelector("#errorMsg");
const resultsDisplay = document.querySelector("#result")
const loader = document.querySelector(".loader")

form.addEventListener("submit", handleSubmit);

function handleSubmit(e) {
    e.preventDefault();

    if(input.value === "") {
        errorMsg.textContent = "Veuillez remplir un terme valide";
        return;
    } else {
        errorMsg.textContent = "";
        loader.style.display = "flex";
        resultsDisplay.textContent = "";
        wikiApiCall(input.value);
    }
}

async function wikiApiCall(searchInput) {

    /* TEST & ERROR */
    try {
        const response = await fetch(`https://fr.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}`)

        if(!response.ok) {
            throw new Error(`${response.status}`);
        }

        const data = await response.json();

        createCards(data.query.search);
    }
    catch (error) {
        errorMsg.textContent = `${error}`;
        loader.style.display = "none";
    }
}

function createCards(data) {
    if(!data.length){
        errorMsg.textContent = "Désolé, je n'ai trouvé aucun résultat...";
        loader.style.display = "none";
        return;
    }
    data.forEach(el => {
        const url = `https://fr.wikipedia.org/?curid=${el.pageid}`;
        const card = document.createElement("div");
        card.className = "linkCard";
        card.innerHTML = `
        <a href="${url}" target="_blank">${el.title}</a>
        <a href="${url}" target="_blank">${url}</a>
        <p p">${el.snippet}</p>
        <br>
        `

        resultsDisplay.appendChild(card);
    });
    loader.style.display = "none";
}