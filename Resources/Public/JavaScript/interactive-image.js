document.addEventListener('DOMContentLoaded', function () {
    const icons = document.querySelectorAll('.mark-icon');
    const container = document.querySelector('.container[data-icon-mode]');
    const iconMode = container ? container.dataset.iconMode : 'same';

    const marksData = {};

    icons.forEach((icon) => {
        const iconId = icon.dataset.uid;
        const popover = document.getElementById(`popover-${iconId}`);
        const popoverBody = popover ? popover.querySelector('.popover-body').innerHTML : 'No information available';

        marksData[iconId] = {
            title: icon.alt,
            bodytext: popoverBody
        };
    });

    icons.forEach((icon) => {
        const iconId = icon.dataset.uid;

        icon.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            const currentlyActivePopover = document.querySelector('.popover.active');
            if (currentlyActivePopover) {
                currentlyActivePopover.classList.remove('active');
                currentlyActivePopover.previousElementSibling.classList.remove('active');
            }

            if (iconMode === 'same') {
                const popover = document.getElementById(`popover-${iconId}`);
                if (popover) {
                    popover.classList.toggle('active');
                    icon.classList.toggle('active');
                }
            } else if (iconMode === 'different') {
                const infoBox = document.querySelector('.information-box');
                const infoHeader = infoBox.querySelector('.information-header h4');
                const infoText = infoBox.querySelector('.information-text');

                const markData = marksData[iconId];
                infoHeader.innerText = markData.title;
                infoText.innerHTML = markData.bodytext;

                icons.forEach(i => i.classList.remove('active'));
                icon.classList.add('active');
            }
        });
    });

    // Add a click listener to the document to close the active popover
    document.addEventListener('click', () => {
        const currentlyActivePopover = document.querySelector('.popover.active');
        if (currentlyActivePopover) {
            currentlyActivePopover.classList.remove('active');
            currentlyActivePopover.previousElementSibling.classList.remove('active');
        }
    });
});
