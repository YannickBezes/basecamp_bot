function drawRowEmoji({ emoji, percentage }) {
    const tableEmoji = document.getElementById('table-emoji');

    const tr = document.createElement('tr');
    tableEmoji.appendChild(tr);

    const tdEmoji = document.createElement('td');
    tdEmoji.classList.add('emoji');
    tdEmoji.innerText = emoji;
    tr.appendChild(tdEmoji);


    const tdPercentage = document.createElement('td');
    tdPercentage.classList.add('th-column-with-buttons');
    tr.appendChild(tdPercentage);

    // percentage
    const span = document.createElement('span');
    span.classList.add('percentage');
    span.innerText = percentage * 100;
    tdPercentage.appendChild(span);

    // button container
    const divButtonContainer = document.createElement('div');
    divButtonContainer.classList.add('button-container');
    tdPercentage.appendChild(divButtonContainer);

    // button edit
    const buttonEdit = document.createElement('button');
    buttonEdit.className = 'button edit';
    buttonEdit.innerText = 'Modifier';
    buttonEdit.addEventListener('click', () => editEmoji(emoji, span))
    divButtonContainer.appendChild(buttonEdit);

    // button delete
    const buttonDelete = document.createElement('button');
    buttonDelete.className = 'button delete';
    buttonDelete.innerText = 'Supprimer';
    buttonDelete.addEventListener('click', () => {
        tr.remove()
    });
    divButtonContainer.appendChild(buttonDelete);
}

function drawRowAuthor(author) {
    const tableAuthor = document.getElementById('table_author');

    const tr = document.createElement('tr');
    tableAuthor.appendChild(tr);


    const td = document.createElement('td');
    td.classList.add('th-column-with-buttons');
    tr.appendChild(td);

    // author
    const span = document.createElement('span');
    span.classList.add('author');
    span.innerText = author;
    td.appendChild(span);

    // button container
    const divButtonContainer = document.createElement('div');
    divButtonContainer.classList.add('button-container');
    td.appendChild(divButtonContainer);

    // button edit
    const buttonEdit = document.createElement('button');
    buttonEdit.className = 'button edit';
    buttonEdit.innerText = 'Modifier';
    buttonEdit.addEventListener('click', () => editAuthor(author, span))
    divButtonContainer.appendChild(buttonEdit);

    // button delete
    const buttonDelete = document.createElement('button');
    buttonDelete.className = 'button delete';
    buttonDelete.innerText = 'Supprimer';
    buttonDelete.addEventListener('click', () => {
        tr.remove()
    });
    divButtonContainer.appendChild(buttonDelete);

}

function drawRowEmojiByAuthor({ emoji, author}) {
    const tableEmojisByAuthor = document.getElementById('table_emoji-author');

    const tr = document.createElement('tr');
    tableEmojisByAuthor.appendChild(tr);

    const tdEmoji = document.createElement('td');
    tdEmoji.classList.add('emoji');
    tdEmoji.innerText = emoji;
    tr.appendChild(tdEmoji);


    const tdPercentage = document.createElement('td');
    tdPercentage.classList.add('th-column-with-buttons');
    tr.appendChild(tdPercentage);

    // author
    const span = document.createElement('span');
    span.classList.add('author');
    span.innerText = author;
    tdPercentage.appendChild(span);

    // button container
    const divButtonContainer = document.createElement('div');
    divButtonContainer.classList.add('button-container');
    tdPercentage.appendChild(divButtonContainer);

    // button edit
    const buttonEdit = document.createElement('button');
    buttonEdit.className = 'button edit';
    buttonEdit.innerText = 'Modifier';
    buttonEdit.addEventListener('click', () => editEmojiByAuthor(emoji, span))
    divButtonContainer.appendChild(buttonEdit);

    // button delete
    const buttonDelete = document.createElement('button');
    buttonDelete.className = 'button delete';
    buttonDelete.innerText = 'Supprimer';
    buttonDelete.addEventListener('click', () => {
        tr.remove()
    });
    divButtonContainer.appendChild(buttonDelete);
}

document.addEventListener('DOMContentLoaded', async () => {
    // Table emojis
    const listEmojis = await getEmojis();
    listEmojis.forEach(({ emoji, percentage }) => {
        drawRowEmoji({ emoji, percentage });
    });
    document.getElementById('button-add').addEventListener('click', () => addEmoji());


    // Table authors
    const listAuthors = await getFromStorage('listAuthors');
    if (listAuthors !== null) {
        listAuthors.forEach(author => drawRowAuthor(author));
    }
    document.getElementById('button-add_author').addEventListener('click', () => addAuthor());


    // Table emojis by authors
    const listEmojisByAuthor = await getFromStorage('listEmojisByAuthor');
    if (listEmojisByAuthor !== null) {
        Object.keys(listEmojisByAuthor).forEach(author => drawRowEmojiByAuthor({ emoji: listEmojisByAuthor[author], author }));
    }
    document.getElementById('button-add_emoji-author').addEventListener('click', () => addEmojiByAuthor());


    // Button save
    document.getElementById('button-save').addEventListener('click', () => save());
});

function save() {
    saveEmojis();
    saveAuthors();
    saveEmojisByAuthor();
}

function saveAuthors() {
    const tableAuthor = document.getElementById('table_author');

    const listAuthors = [];
    for (let i = 0; i < tableAuthor.childElementCount; i++) {
        const tr = tableAuthor.children[i];

        const author = tr.getElementsByClassName('author')[0].innerText;

        listAuthors.push(author);
    }

    chrome.storage.sync.set({ listAuthors });
}

function saveEmojisByAuthor() {
    const tableEmojisByAuthor = document.getElementById('table_emoji-author');

    const listEmojisByAuthor = {};
    for (let i = 0; i < tableEmojisByAuthor.childElementCount; i++) {
        const tr = tableEmojisByAuthor.children[i];

        const emoji = tr.getElementsByClassName('emoji')[0].innerText;
        const author = tr.getElementsByClassName('author')[0].innerText;

        listEmojisByAuthor[author] = emoji;
    }

    chrome.storage.sync.set({ listEmojisByAuthor });
}

function saveEmojis() {
    const tableEmoji = document.getElementById('table-emoji');

    const listEmojis = [];
    for (let i = 0; i < tableEmoji.childElementCount; i++) {
        const tr = tableEmoji.children[i];

        const emoji = tr.getElementsByClassName('emoji')[0].innerText;
        const percentage = tr.getElementsByClassName('percentage')[0].innerText;

        listEmojis.push({ emoji, percentage: percentage / 100 });
    }

    // Check if total of emoji is equal to 1
    const total = listEmojis.reduce((acc, { percentage }) => acc + percentage, 0);
    const spanError = document.getElementById('save-error');
    if (total !== 1) {
        if (spanError.classList.contains('hidden')) {
            spanError.classList.remove('hidden');
        }
    } else {
        if (!spanError.classList.contains('hidden')) {
            spanError.classList.add('hidden');
        }
        chrome.storage.sync.set({ listEmojis });
    }
}

function addAuthor() {
    const author = prompt('Auteur :');

    if (author !== null && author !== '') {
        drawRowAuthor(parseAuthor(author));
    }
}

function addEmojiByAuthor() {
    const emoji = prompt('Emoji :');

    if (emoji !== null && emoji !== '') {
        let author = prompt(`Auteur pour l'emoji ${emoji}`);

        if (author !== null && author !== '') {
            drawRowEmojiByAuthor({ emoji, author: parseAuthor(author) });
        }
    }
}

function parseAuthor(name) {
    return removeDiacritics(name).toLowerCase()
}

function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function addEmoji() {
    const emoji = prompt('Emoji :');

    if (emoji !== null && emoji !== '') {
        let percentage = prompt(`Pourcentage d'apparition de l'émoji ${emoji}`);

        if (percentage !== null && percentage !== '') {
            if (parseFloat(percentage) >= 1 && percentage !== '1.00') {
                percentage /= 100;
            }
            drawRowEmoji({ emoji, percentage });
        }
    }
}

function editEmoji(emoji, span) {
    let percentage = prompt(`Nouveau pourcentage d'apparition pour l'emoji ${emoji}`);

    if (percentage !== null && percentage !== '') {
        if (parseFloat(percentage) >= 1 && percentage !== '1.00') {
            percentage /= 100;
        }
        span.innerText = percentage * 100;
    }
}

function editEmojiByAuthor(emoji, span) {
    let author = prompt(`Editer auteur pour l'emoji ${emoji}`, span.innerText);

    if (author !== null && author !== '') {
        span.innerText = author;
    }
}

function editAuthor(author, span) {
    let newAuthor = prompt('Editer l\' auteur', author);

    if (newAuthor !== null && newAuthor !== '') {
        span.innerText = parseAuthor(newAuthor);
    }
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

async function getFromStorage(key) {
    return new Promise(resolve => {
        chrome.storage.sync.get(key, resolve);
    }).then(result => {
        if (key === null) {
            return result;
        } else if (typeof  result[key] === 'undefined') {
            return  null;
        } else {
            return result[key];
        }
    });
}
