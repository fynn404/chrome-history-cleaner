// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('History Cleaner & Stats extension installed');
});

// Optional: Add any background tasks here if needed in the future 