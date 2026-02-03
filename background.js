// Background script to manage recording state and handle messages

let isRecording = false;
let recordedSteps = [];

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startRecording") {
    isRecording = true;
    recordedSteps = [];
    // Inject logic if needed, or just set state
    chrome.storage.local.set({ isRecording: true, steps: [] });
    // Update icon to indicate recording?
    console.log("Recording started");
    sendResponse({ status: "started" });
  } else if (request.action === "stopRecording") {
    isRecording = false;
    chrome.storage.local.set({ isRecording: false });
    console.log("Recording stopped");

    // Open viewer page
    chrome.tabs.create({ url: 'viewer/viewer.html' });

    sendResponse({ status: "stopped", steps: recordedSteps });
  } else if (request.action === "logStep") {
    if (isRecording) {
      console.log("Step logged:", request.step);
      recordedSteps.push(request.step);
      // Save to storage immediately to be safe
      chrome.storage.local.get(['steps'], (result) => {
        const steps = result.steps || [];
        steps.push(request.step);
        chrome.storage.local.set({ steps: steps });
      });

      // Take screenshot if requested
      if (request.takeScreenshot) {
        chrome.tabs.captureVisibleTab(sender.tab.windowId, { format: "png" }, (dataUrl) => {
          // Attach screenshot to the last step
          chrome.storage.local.get(['steps'], (result) => {
            const steps = result.steps || [];
            if (steps.length > 0) {
              steps[steps.length - 1].screenshot = dataUrl;
              chrome.storage.local.set({ steps: steps });
            }
          });
        });
      }
    }
  }
  return true; // Keep message channel open for async response
});
