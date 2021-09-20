const QUERY_SELECTOR_AUTHOR = '.thread-entry__author'

async function getFromStorage(key) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(key, resolve);
    }).then(result => {
        if (key == null) return result;
        else return result[key];
    });
}

async function putBoosts() {
    // Get name of user
    let name = removeDiacritics(await getFromStorage("name")).toLowerCase();

    // Get list of articles
    const articles = await findPostWithoutBoosts(name);

    if (articles.length > 0) {
        // Ask to user if he want to boosts the posts
        const res = confirm(`Do you want to boosts ${articles.length} posts ?`);

        if (res) {
            for (const ar of articles) {
                const boostDiv = ar.querySelector(':scope label[aria-label="Add a boost"]');

                boostDiv.click();
                await sleep(200);
                const input = boostDiv.querySelector('input');

                // Get emoji for author of the boosts
                input.value = await getEmoji(parseAuthorName(ar.querySelector(QUERY_SELECTOR_AUTHOR)));

                await sleep(200);
                //ar.querySelector('input[type="submit"]').click() // Send boost
                await sleep(300);
            }

            // Scroll to the last articles
            const lastArticle = articles[articles.length - 1];
            scrollTo(0, lastArticle.offsetTop + lastArticle.offsetHeight);
        }
    } else {
        alert('No articles has been found');
    }
}

async function getEmoji(author) {
    const emojisOverrideByAuthor = await getFromStorage('listEmojisByAuthor');

    if (emojisOverrideByAuthor !== null && emojisOverrideByAuthor.keys().length > 0 &&emojisOverrideByAuthor.keys().includes(author)) {
        return emojisOverrideByAuthor[author];
    }
    const emojis = await getEmojis();
    return getRandom(emojis);
}

function getRandom(emojis) {
    const weights = emojis.map(({ percentage }) => percentage);
    const results = emojis.map(({ emoji }) => emoji);
    let num = Math.random();
    let s = 0;
    let lastIndex = weights.length - 1;

    for (let i = 0; i < lastIndex; ++i) {
        s += weights[i];
        if (num < s) {
            return results[i];
        }
    }

    return results[lastIndex];
}

async function findPostWithoutBoosts(name) {
    let findAnArticleWidthABoost = false;
    let maxDateHasPassed = false;
    let offset = 0;

    let articlesWithoutBoosts = [];
    // const maxDate = getFromStorage('maxDate');

    let lastLengthArticles = 0;
    // Stop to find articles when we have found an articles
    // while (!findAnArticleWidthABoost && maxDateHasPassed) {
    while (!findAnArticleWidthABoost) {
        let articles = Array.from(document.querySelectorAll(".thread-entry.thread-entry--with-discuss"));

        if (articles.length > lastLengthArticles) {
            lastLengthArticles = articles.length;
            articles = articles.splice(offset);

            if (articles.length === 0) { // We can't get articles so stop here
                findAnArticleWidthABoost = true;
                console.log('stop because there is no articles');
            }

            for (const ar of articles) {
                const author = parseAuthorName(ar.querySelector(QUERY_SELECTOR_AUTHOR));
                const listOfAuthors = await getFromStorage('listAuthors');

                if (author !== name && (listOfAuthors.includes(author) || listOfAuthors.length === 0)) {
                    // Check if we already have boosts this post
                    if (!alreadyBoosts(ar, name)) {
                        articlesWithoutBoosts.push(ar);
                    } else {
                        findAnArticleWidthABoost = true;
                        break; // Stop the loop
                    }
                }
                offset++; // Increment offset
            }
        }
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

if (window.location.hostname === "3.basecamp.com") {
    putBoosts();
}

async function getEmojis() {
    return new Promise(resolve => {
        chrome.storage.sync.get('listEmojis', ({ listEmojis }) => {
            if (typeof listEmojis !== 'undefined' && listEmojis !== null && Array.isArray(listEmojis) && listEmojis.length > 0) {
                resolve(listEmojis);
            } else {
                resolve([
                    { emoji: '👍', percentage: 0.9 },
                    { emoji: '👀', percentage: 0.1 }
                ]);
            }
        });
    });
}
