// Content script to intercept user interactions

// Listener for clicks
document.addEventListener('click', (event) => {
    chrome.storage.local.get(['isRecording'], (result) => {
        if (result.isRecording) {
            // Need to capture this before it happens effectively, or just log it.
            // visual feedback could be added here.

            const target = event.target;
            const description = `Click on ${target.tagName} ${target.innerText ? `"${target.innerText.substring(0, 20)}..."` : ''}`;
            const step = {
                type: 'click',
                description: description,
                timestamp: Date.now(),
                selector: getCssSelector(target)
            };

            // Send to background to log and potentially snap screenshot
            // We want the screenshot BEFORE the action changes the page, but sometimes AFTER the UI updates (like a hover menu).
            // For now, let's try sending immediately.
            chrome.runtime.sendMessage({
                action: "logStep",
                step: step,
                takeScreenshot: true
            });

            showClickIndicator(event.pageX, event.pageY);
        }
    });
}, true); // Capturing phase to catch it early

// Helper to generate a simple selector
function getCssSelector(el) {
    if (!(el instanceof Element)) return;
    const path = [];
    while (el.nodeType === Node.ELEMENT_NODE) {
        let selector = el.nodeName.toLowerCase();
        if (el.id) {
            selector += '#' + el.id;
            path.unshift(selector);
            break;
        } else {
            let sib = el, nth = 1;
            while (sib = sib.previousElementSibling) {
                if (sib.nodeName.toLowerCase() == selector)
                    nth++;
            }
            if (nth != 1)
                selector += ":nth-of-type(" + nth + ")";
        }
        path.unshift(selector);
        el = el.parentNode;
    }
    return path.join(" > ");
}

// Visual feedback function
function showClickIndicator(x, y) {
    const indicator = document.createElement('div');
    indicator.style.position = 'absolute';
    indicator.style.left = (x - 10) + 'px';
    indicator.style.top = (y - 10) + 'px';
    indicator.style.width = '20px';
    indicator.style.height = '20px';
    indicator.style.borderRadius = '50%';
    indicator.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
    indicator.style.pointerEvents = 'none';
    indicator.style.zIndex = '999999';
    indicator.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';

    document.body.appendChild(indicator);

    requestAnimationFrame(() => {
        indicator.style.transform = 'scale(2)';
        indicator.style.opacity = '0';
    });

    setTimeout(() => {
        indicator.remove();
    }, 500);
}
