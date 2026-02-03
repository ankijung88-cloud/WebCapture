document.addEventListener('DOMContentLoaded', () => {
    const actionBtn = document.getElementById('actionBtn');
    const statusBadge = document.getElementById('statusBadge');
    const descriptionText = document.getElementById('descriptionText');
    const timer = document.getElementById('timer');
    const viewGuidesBtn = document.getElementById('viewGuidesBtn');

    let timerInterval;
    let startTime;

    // Check initial state
    chrome.storage.local.get(['isRecording', 'startTime'], (result) => {
        if (result.isRecording) {
            setRecordingState(true);
            if (result.startTime) {
                startTime = result.startTime;
                startTimer();
            }
        } else {
            setRecordingState(false);
        }
    });

    actionBtn.addEventListener('click', () => {
        chrome.storage.local.get(['isRecording'], (result) => {
            const isRecording = result.isRecording;

            if (!isRecording) {
                // Start Recording
                chrome.runtime.sendMessage({ action: "startRecording" }, (response) => {
                    if (response && response.status === "started") {
                        startTime = Date.now();
                        chrome.storage.local.set({ startTime: startTime });
                        setRecordingState(true);
                        startTimer();
                        // Close popup to let user interact
                        window.close();
                    }
                });
            } else {
                // Stop Recording
                chrome.runtime.sendMessage({ action: "stopRecording" }, (response) => {
                    if (response && response.status === "stopped") {
                        setRecordingState(false);
                        stopTimer();
                    }
                });
            }
        });
    });

    viewGuidesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: 'viewer/viewer.html' });
    });

    function setRecordingState(isRecording) {
        if (isRecording) {
            actionBtn.innerHTML = '<span class="icon">■</span> Stop Recording';
            actionBtn.classList.remove('btn-primary');
            actionBtn.classList.add('btn-danger');

            statusBadge.textContent = 'Recording';
            statusBadge.style.background = 'rgba(255, 71, 87, 0.2)';
            statusBadge.style.color = '#ff4757';
            statusBadge.style.borderColor = '#ff4757';
            statusBadge.classList.add('recording-pulse');

            descriptionText.textContent = 'Recording in progress...';
            timer.style.display = 'block';
        } else {
            actionBtn.innerHTML = '<span class="icon">●</span> Start Recording';
            actionBtn.classList.remove('btn-danger');
            actionBtn.classList.add('btn-primary');

            statusBadge.textContent = 'Ready';
            statusBadge.style.background = 'rgba(255, 255, 255, 0.1)';
            statusBadge.style.color = 'white';
            statusBadge.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            statusBadge.classList.remove('recording-pulse');

            descriptionText.textContent = 'Click below to start recording your steps.';
            timer.style.display = 'none';
        }
    }

    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            const now = Date.now();
            const diff = now - startTime;
            const seconds = Math.floor((diff / 1000) % 60);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            timer.textContent = `${pad(minutes)}:${pad(seconds)}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timer.textContent = '00:00';
    }

    function pad(num) {
        return num.toString().padStart(2, '0');
    }
});
