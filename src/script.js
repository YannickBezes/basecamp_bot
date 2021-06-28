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

    const articles = await findPostWithoutBoosts(name);

    const res = confirm(`Do you want to boosts ${articles.length} posts ?`);    
    
    if(res) {
        articles.forEach(async ar => {
            const boostDiv = ar.querySelector(':scope label[aria-label="Add a boost"]');
    
            boostDiv.click();
            await sleep(200);
            const input = boostDiv.querySelector('input');
            input.value = "👍";
    
            await sleep(200);
            ar.querySelector('input[type="submit"]').click() // Send boost
            await sleep(300);
        });
    }

    // Scroll to the last articles
    scrollTo(0, articles[articles.length - 1].offsetTop);
}

async function findPostWithoutBoosts(name, max_date) {
    let findAnArticleWidthABoost = false;
    let offset = 0;

    let articlesWithoutBoosts = [];

    while (!findAnArticleWidthABoost) {
        let articles = Array.from(document.querySelectorAll(".thread-entry.thread-entry--with-discuss")).splice(offset);
        articles.forEach(async ar => {
            if (findAnArticleWidthABoost) return; // Stop the loop
            const author = parseAuthorName(ar.querySelector(':scope header.thread-entry__header'));
        
            if(author !== name) { // If it's not me boosts message
                // Check if we already have boosts this post
                if(!alreadyBoosts(ar, name)) {
					articlesWithoutBoosts.push(ar);
                } else {
                    findAnArticleWidthABoost = true;
                }
            }
            offset++; // Increment offset
        });
        scrollBy(0, window.innerHeight);
        await sleep(500);
    }
    return articlesWithoutBoosts;
}

function alreadyBoosts(ar, name) {
    let isAlreadyBoost = false;
    const boostsList = ar.querySelectorAll('div.boost');
    boostsList.forEach(boost => {
        if (removeDiacritics(boost.querySelector('img').title).toLowerCase().includes(name)) {
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
