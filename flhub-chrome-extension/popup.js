chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log("tabs query");
    chrome.tabs.sendMessage(tabs[0].id, { message: "text" }, function (response) {
        //If you need a response, do stuff with it here
    });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("message");
    //Do stuff here
    //sendResponse({message:"stuff"});
});