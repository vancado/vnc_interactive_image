document.addEventListener('DOMContentLoaded', () => {
    const markers = document.querySelectorAll('.marks');
    const container = document.querySelector('.container[data-layout]');
    const layout = container ? container.dataset.layout : 'popover';
    // const infoBoxNav = document.querySelectorAll('.')

    markers.forEach((marker) => {
        const markerId = marker.querySelector('.mark-icon-image, .mark-icon, .number').dataset.uid;

        marker.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (layout === 'infoBox') {
                document.querySelectorAll('.info-item').forEach(infoItem => {
                    if (infoItem) {
                        infoItem.classList.remove('active');
                    }
                });
                const infoItem = document.getElementById(`info-${markerId}`);
                if (infoItem) {
                    infoItem.classList.add('active');
                }
            } else {
                const currentlyActivePopover = document.querySelector('.popover.active');
                if (currentlyActivePopover) {
                    currentlyActivePopover.classList.remove('active');
                    const previousMarker = currentlyActivePopover.previousElementSibling;
                    if (previousMarker) {
                        previousMarker.classList.remove('active');
                    }
                }
                const popover = document.getElementById(`popover-${markerId}`);
                if (popover) {
                    popover.classList.toggle('active');
                    marker.classList.toggle('active');
                }
            }
        });
    });

    // Show only the first marker info by default in infoBox layout
    if (layout === 'infoBox' && markers.length > 0) {
        markers[0].click();
    }

    // Add a click listener to the document to close the active popover
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.marks') && !event.target.closest('.popover')) {
            const currentlyActivePopover = document.querySelector('.popover.active');
            if (currentlyActivePopover) {
                currentlyActivePopover.classList.remove('active');
                const previousMarker = currentlyActivePopover.previousElementSibling;
                if (previousMarker) {
                    previousMarker.classList.remove('active');
                }
            }
        }
    });
});
