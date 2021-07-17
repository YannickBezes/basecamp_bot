async function getEmojis() {
    return new Promise(resolve => {
        chrome.storage.sync.get('listEmojis', ({ listEmojis }) => {
            console.log(listEmojis);
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

