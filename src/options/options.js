function drawRaw({ emoji, percentage }) {
    const tableEmoji = document.getElementById('table-emoji');

    const tr = document.createElement('tr');
    tableEmoji.appendChild(tr);

    const tdEmoji = document.createElement('td');
    tdEmoji.innerText = emoji;
    tr.appendChild(tdEmoji);


    const tdPercentage = document.createElement('td');
    tdPercentage.classList.add('td-percentage')
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
    buttonEdit.innerText = 'Modifier'
    divButtonContainer.appendChild(buttonEdit);

    // button delete
    const buttonDelete = document.createElement('button');
    buttonDelete.className = 'button delete';
    buttonDelete.innerText = 'Supprimer'
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

    document.getElementById('button-save').addEventListener('click', () => {

    });
})

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

async function getEmojis() {
    return [
        { emoji: '👍', percentage: 0.9 },
        { emoji: '👀', percentage: 0.1 }
    ];
    // return new Promise(resolve => {
    //     chrome.storage.sync.get('listEmojis', (data) => {
    //         resolve(data);
    //     })
    // })
}