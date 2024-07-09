document.addEventListener('DOMContentLoaded', function () {
    const icons = document.querySelectorAll('.mark-icon');

    icons.forEach((icon) => {
        const iconId = icon.dataset.uid;
        const popover = document.getElementById(`popover-${iconId}`);

        icon.addEventListener('click', (event) => {
            event.stopPropagation();
            popover.classList.toggle('active');
            icon.classList.toggle('active');

            document.addEventListener('click', () => {
                const popovers = document.querySelectorAll('.popover');
                
                popovers.forEach((popover) => {
                    popover.classList.remove('active');
                    icon.classList.remove('active');
                });
            });
        });
    });
});