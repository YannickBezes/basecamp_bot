buttonBoost.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    let name = document.getElementById('inputName').value;
    chrome.storage.sync.set({ name });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['script.js']
    });
});

document.addEventListener('DOMContentLoaded', async () => {
    const inputName = document.getElementById('inputName');
    
    chrome.storage.sync.get("name", ({ name }) => {
        inputName.value = name;
    });
});