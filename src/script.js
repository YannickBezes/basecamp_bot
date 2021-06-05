async function getFromStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(key, resolve);
    }).then(result => {
        if (key == null) return result;
        else return result[key];
    });
}

async function putBoosts() {
    let name = removeDiacritics(await getFromStorage("name")).toLowerCase();

    let findAnArticleWidthABoost = false;
    let offset = 0;

    while (!findAnArticleWidthABoost) {
        let articles = Array.from(document.querySelectorAll(".thread-entry.thread-entry--with-discuss")).splice(offset);
        articles.forEach(async ar => {
            if (findAnArticleWidthABoost) return; // Stop the loop

            const author = parseAuthorName(ar.querySelector(':scope header.thread-entry__header'));
            // const boostDiv = ar.querySelector(':scope label[aria-label="Add a boost"]');
        
            if(author !== name) { // If it's not me boosts message
                // Check if we already have boosts this post
                if(!alreadyBoosts(ar, name)) {
                    boostDiv.click();
                    await sleep(200);
                    const input = boostDiv.querySelector('input');
                    input.value = "👍";
            
                    await sleep(200);
                    ar.querySelector('input[type="submit"]').click() // Send boost
                } else {
                    findAnArticleWidthABoost = true;
                }
            }
            offset++; // Increment offset
            await sleep(300);
        });

        scrollBy(0, 1000);
        await sleep(1000);
    }
}

function alreadyBoosts(ar, name) {
    let isAlreadyBoost = false;
    const boostsList = ar.querySelectorAll('div.boost');
    boostsList.forEach(boost => {
        if (boost.querySelector('img').title.toLowerCase().includes(name)) {
            isAlreadyBoost = true;
        }
    });
    return isAlreadyBoost;
}

function parseAuthorName(html) {
    return removeDiacritics(html.innerText.split(',')[0].split('\n')[0]).toLowerCase();
}


function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function sleep(ms) {
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}

putBoosts();