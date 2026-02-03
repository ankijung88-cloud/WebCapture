document.addEventListener('DOMContentLoaded', () => {
    const stepsList = document.getElementById('stepsList');
    const guideTitle = document.getElementById('guideTitle');
    const recordDate = document.getElementById('recordDate');
    const stepCount = document.getElementById('stepCount');
    const exportBtn = document.getElementById('exportBtn');
    const printBtn = document.getElementById('printBtn');

    // Set date
    recordDate.textContent = new Date().toLocaleDateString();

    // Load data
    chrome.storage.local.get(['steps'], (result) => {
        const steps = result.steps || [];
        stepCount.textContent = steps.length;

        if (steps.length > 0) {
            stepsList.innerHTML = ''; // Clear empty state
            steps.forEach((step, index) => {
                const stepCard = createStepCard(step, index + 1);
                stepsList.appendChild(stepCard);
            });
        }
    });

    // Print functionality
    printBtn.addEventListener('click', () => {
        window.print();
    });

    // Export functionality (Basic HTML export)
    exportBtn.addEventListener('click', () => {
        const htmlContent = document.documentElement.outerHTML;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'guide-export.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    function createStepCard(step, index) {
        const card = document.createElement('div');
        card.className = 'step-card';

        const header = document.createElement('div');
        header.className = 'step-header';

        const number = document.createElement('div');
        number.className = 'step-number';
        number.textContent = index;

        const desc = document.createElement('div');
        desc.className = 'step-description';
        desc.contentEditable = 'true';
        desc.textContent = step.description || 'No description';

        header.appendChild(number);
        header.appendChild(desc);

        card.appendChild(header);

        if (step.screenshot) {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'step-image-container';

            const img = document.createElement('img');
            img.className = 'step-image';
            img.src = step.screenshot;

            imgContainer.appendChild(img);
            card.appendChild(imgContainer);
        }

        return card;
    }
});
