function drawRaw({ emoji, percentage }) {
    const tableEmoji = document.getElementById('table-emoji');

    const tr = document.createElement('tr');
    tableEmoji.appendChild(tr);

    const tdEmoji = document.createElement('td');
    tdEmoji.classList.add('emoji');
    tdEmoji.innerText = emoji;
    tr.appendChild(tdEmoji);


    const tdPercentage = document.createElement('td');
    tdPercentage.classList.add('td-percentage');
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

document.addEventListener('DOMContentLoaded', async () => {
    const listEmojis = await getEmojis();

    listEmojis.forEach(({ emoji, percentage }) => {
        drawRaw({ emoji, percentage });
    });

    document.getElementById('button-add').addEventListener('click', () => addEmoji());

    document.getElementById('button-save').addEventListener('click', () => saveEmojis());
});

function saveEmojis() {
    const tableEmoji = document.getElementById('table-emoji');

    const listEmojis = [];
    console.log(tableEmoji.childElementCount);
    for (let i = 0; i < tableEmoji.childElementCount; i++) {
        const tr = tableEmoji.children[i];

        const emoji = tr.getElementsByClassName('emoji')[0].innerText;
        const percentage = tr.getElementsByClassName('percentage')[0].innerText;

        listEmojis.push({ emoji, percentage: percentage / 100 });
    }

    chrome.storage.sync.set({ listEmojis });
}

function addEmoji() {
    const emoji = prompt('Emoji :');

    if (emoji !== null && emoji !== '') {
        let percentage = prompt(`Pourcentage d'apparition de l'émoji ${emoji}`);

        if (percentage !== null && percentage !== '') {
            if (parseFloat(percentage) >= 1 && percentage !== '1.00') {
                percentage /= 100;
            }
            drawRaw({ emoji, percentage });
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
