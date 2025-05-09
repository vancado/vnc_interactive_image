window.VNC_INTERACTIVE_IMAGE = {
    MAX_MOBILE_WIDTH: 1024,
};

document.addEventListener("DOMContentLoaded", () => {
    const vncInteractiveImageContainers = document.querySelectorAll('.vncInteractiveImageContainer');
    const vncInteractiveImages = document.querySelectorAll('.vncInteractiveImage');
    const eventAfterShowDesktopPopover = new Event('afterShowDesktopPopover');
    const eventAfterShowMobilePopover = new Event('afterShowMobilePopover');
    const eventAfterHidePopover = new Event('afterHidePopover');
    const eventAfterPositioning = new Event('afterPositioning');
    const eventAfterScrollIntoView = new Event('afterScrollIntoView');

    vncInteractiveImages.forEach(vncInteractiveImage => {
        const markers = vncInteractiveImage.querySelectorAll(".mark");
        const container = vncInteractiveImage.querySelector(".container[data-layout]");
        const marksContainer = vncInteractiveImage.querySelector(".marks-container");
        const layout = container ? container.dataset.layout : "popover";
        const scrollIntoView = vncInteractiveImage?.dataset.scrollIntoView;
        const showZoom = vncInteractiveImage?.dataset.showZoom;
        const image = vncInteractiveImage.querySelector(".img-fluid");
        const infoItems = vncInteractiveImage.querySelectorAll(".info-item");
        const navPointsContainer = vncInteractiveImage.querySelector(".nav-points");

        let currentIndex = 0;
        let navPointsInitialized = false;

        const showCurrentInfoItem = () => {
            infoItems.forEach((item, index) => {
                item.classList = index === currentIndex ? "info-item d-flex flex-column flex-grow-1" : "d-none";
                item.classList.toggle("active", index === currentIndex);

                if (index === currentIndex && scrollIntoView === 'true' && navPointsInitialized) {
                    if (layout === 'popover' && window.innerWidth <= window.VNC_INTERACTIVE_IMAGE.MAX_MOBILE_WIDTH) {
                        item.scrollIntoView();
                        item.dispatchEvent(eventAfterScrollIntoView);
                    } else if (layout === 'infoBox') {
                        item.scrollIntoView();
                        item.dispatchEvent(eventAfterScrollIntoView);
                    }
                }

                const navPoints = navPointsContainer?.querySelectorAll(".nav-point");
                navPoints?.forEach((point, pointIndex) => {
                    point.classList.toggle("active", pointIndex === currentIndex);
                });
            });
        };

        const showPreviousItem = () => {
            currentIndex = currentIndex === 0 ? infoItems.length - 1 : currentIndex - 1;
            showCurrentInfoItem();
        };

        const showNextItem = () => {
            currentIndex = currentIndex === infoItems.length - 1 ? 0 : currentIndex + 1;
            showCurrentInfoItem();
        };

        const generateNavPoints = () => {
            if (infoItems.length < 2) {
                return;
            }

            navPointsContainer.innerHTML = "";

            infoItems.forEach((_, index) => {
                const point = document.createElement("button");
                point.classList.add("nav-point");
                point.dataset.index = index;
                point.setAttribute('aria-label', `Beschreibung für ${index+1}. Markierung`);

                point.addEventListener("click", () => {
                    currentIndex = index;
                    showCurrentInfoItem();
                });

                navPointsContainer.appendChild(point);
            });

            showCurrentInfoItem();
            navPointsInitialized = true;
        };

        const handleMarkerClick = (marker, markerId, event) => {
            if (event.target.closest('.content-box')) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            if (layout === "infoBox") {

                infoItems.forEach((infoItem) => infoItem.classList.remove("active"));
                const infoItem = document.getElementById(markerId);
                if (infoItem) {
                    currentIndex = Array.from(infoItems).indexOf(infoItem);
                    showCurrentInfoItem();
                }

            } else {

                infoItems.forEach((infoItem) => infoItem.classList.remove("active"));
                const infoItem = document.querySelector('.content-box__info #' + markerId);
                if (infoItem) {
                    currentIndex = Array.from(infoItems).indexOf(infoItem);
                    showCurrentInfoItem();
                }

                const currentlyActivePopover = vncInteractiveImage.querySelector(".content-box__popover.active");
                if (currentlyActivePopover && currentlyActivePopover !== marker) {
                    currentlyActivePopover.classList.remove("active");
                    const previousMarker = currentlyActivePopover.closest(".mark");
                    if (previousMarker) {
                        previousMarker.classList.remove("active");
                    }
                }

                const popover = vncInteractiveImage.querySelector(`#${markerId}`);
                if (popover) {
                    const popovers = vncInteractiveImage.querySelectorAll(".content-box__popover");
                    const markerRect = marker.getBoundingClientRect();
                    const containerRect = container.getBoundingClientRect();
                    const vncInteractiveImageRect = vncInteractiveImage.getBoundingClientRect();

                    popover.classList.remove("left", "right");

                    const markerCenterX = markerRect.left + markerRect.width / 2;

                    if (markerCenterX > window.innerWidth / 2) {
                        popover.classList.add("left");
                    } else {
                        popover.classList.add("right");
                    }

                    popover.classList.toggle("active");
                    marker.classList.toggle("active");
                    const popoverRect = popover.getBoundingClientRect();

                    popovers?.forEach((item) => {
                        if (item !== popover) {
                            item.classList.remove("active");
                            item.parentElement.classList.remove("active");
                            item.dispatchEvent(eventAfterHidePopover);
                        }
                    });
                    markers?.forEach((item) => (item.style.zIndex = 1));
                    marker.style.zIndex = 2;

                    popover.style = null;
                    let y1 = Math.round((vncInteractiveImageRect.height - popoverRect.height) / 2);
                    const y2 = parseInt(marker.style.top);

                    if (document.fullscreenElement) {
                        y1 = Math.round((window.innerHeight - popoverRect.height) / 2);
                    }

                    popover.style.top = (y1 - y2) + "px";

                    const isMobile = window.matchMedia("(max-width: " + window.VNC_INTERACTIVE_IMAGE.MAX_MOBILE_WIDTH + "px)").matches;
                    if (isMobile) {
                        popover.classList.remove("top", "bottom", "left", "right");
                        // document.querySelectorAll('.content-box__image').forEach(el => el.remove());
                        if (document.fullscreenElement) {
                            const popoverClone = popover.cloneNode(true);
                            vncInteractiveImage.querySelectorAll('.image-container > .content-box__popover').forEach(box => {
                                box.remove();
                            });
                            popoverClone.style.bottom = 'auto';
                            popoverClone.style.top = parseInt(marker.style.top) + 'px';
                            imageContainer.prepend(popoverClone);
                        } else {
                            popover.style = null;
                            // imageContainer.append(popover);
                            popover.dispatchEvent(eventAfterShowMobilePopover);
                        }
                    } else {
                        if (popover.parentNode === imageContainer) {
                            marker.querySelector('.mark-title')?.after(popover);
                        }
                        popover.dispatchEvent(eventAfterShowDesktopPopover);
                    }
                }
            }
        };

        markers.forEach((marker, index) => {
            const iconElement = marker.querySelector(".mark-icon, .mark-icon--number");
            const markerId = iconElement ? iconElement.dataset.uid : undefined;

            if (!markerId) {
                console.error("Marker ID not found for marker:", marker);
                return;
            }

            marker.addEventListener("click", (event) => {
                handleMarkerClick(marker, markerId, event);
            });

            if (layout === "infoBox" && index === 0) {
                marker.click();
            }
        });

        if (infoItems.length > 0) {
            generateNavPoints();
        }

        const prevButtons = vncInteractiveImage.querySelectorAll(".nav-prev");
        if (prevButtons) {
            prevButtons.forEach((button) => {
                button.addEventListener("click", showPreviousItem);
            });
        }

        const nextButtons = vncInteractiveImage.querySelectorAll(".nav-next");
        if (nextButtons) {
            nextButtons.forEach((button) => {
                button.addEventListener("click", showNextItem);
            });
        }

        vncInteractiveImage.addEventListener("click", (event) => {
            const activePopover = vncInteractiveImage.querySelector(".content-box__popover.active");

            if (!event.target.closest(".mark") && !event.target.closest(".content-box__popover")) {
                if (activePopover) {
                    activePopover.classList.remove("active");
                    activePopover.dispatchEvent(eventAfterHidePopover);

                    const activeMarker = activePopover.closest(".mark");
                    if (activeMarker) {
                        activeMarker.classList.remove("active");
                    }
                }
            }
        });

        vncInteractiveImage.querySelectorAll('.content-box__close')?.forEach((button) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const popover = e.target.closest(".content-box__popover");
                if (popover) {
                    const marker = popover.closest(".mark");
                    if (marker) {
                        marker.classList.remove("active");
                    }
                    popover.classList.remove("active");
                    popover.dispatchEvent(eventAfterHidePopover);
                }
            });
        });

        // Disable dragging of the image
        image.setAttribute("draggable", false);

        // Zoom and Pan Logic
        const zoomControls = vncInteractiveImage.querySelector(".zoom-controls");
        const zoomInButton = vncInteractiveImage.querySelector("#zoom-in");
        const zoomOutButton = vncInteractiveImage.querySelector("#zoom-out");
        let initialPinchDistance = null;
        const fullscreenButton = vncInteractiveImage.querySelector("#fullscreen");
        const imageContainer = vncInteractiveImage.querySelector(".image-container");
        const markersOriginalPosition = [];

        zoomControlsOriginalPosition = [
            zoomControls ? getComputedStyle(zoomControls).right : 0,
            zoomControls ? getComputedStyle(zoomControls).bottom : 0,
        ];

        let scale = 1;
        const scaleStep = 0.1;

        markers.forEach((marker, i) => {
            const computedStyle = getComputedStyle(marker);
            markersOriginalPosition[i] = [
                parseFloat(marker.style.left) / 100,
                parseFloat(marker.style.top) / 100,
                parseFloat(computedStyle.paddingLeft),
                parseFloat(computedStyle.paddingTop),
            ];
        });

        const updateMarkers = () => {
            // set scale for marker positions depending on image scale
            let markerScale = 1;
            const imageTransform = getComputedStyle(image).transform;
            if (imageTransform !== 'none') {
                markerScale = parseFloat(imageTransform.replace('matrix(', '').replace(')', ''))
            }

            markers.forEach((marker, i) => {
                marker.style.left = ((markerScale * markersOriginalPosition[i][0] * image.clientWidth)) + "px";
                marker.style.top = ((markerScale * markersOriginalPosition[i][1] * image.clientHeight) - markersOriginalPosition[i][3]) + "px";
                marker.dispatchEvent(eventAfterPositioning);
            });
        };

        window.addEventListener("load", updateMarkers);
        window.addEventListener("resize", updateMarkers);

        vncInteractiveImage.closest('.vncInteractiveImageContainer')?.addEventListener("shown.bs.collapse", updateMarkers);
        vncInteractiveImage.closest('.carousel')?.addEventListener("slid.bs.carousel", updateMarkers);

        const updateZoomControls = () => {
            if (document.fullscreenElement) {
                zoomControls.style.position = "fixed";
                zoomControls.style.right = "10px";
                zoomControls.style.bottom = "10px";
                zoomControls.style.marginRight = '0';
                zoomControls.style.marginBottom = '0';
                imageContainer.append(zoomControls);
            } else {
                zoomControls.style.position = 'absolute';
                zoomControls.style.right = zoomControlsOriginalPosition[0];
                zoomControls.style.bottom = zoomControlsOriginalPosition[1];
                zoomControls.style.marginRight = Math.round((-1) * parseFloat(imageContainer.scrollLeft), 2) + 'px';
                zoomControls.style.marginBottom = Math.round((-1) * parseFloat(imageContainer.scrollTop), 2) + 'px';
                imageContainer.append(zoomControls);
            }
        };

        imageContainer.addEventListener('scrollstart', updateZoomControls);
        imageContainer.addEventListener('scroll', updateZoomControls);
        imageContainer.addEventListener('scrollend', updateZoomControls);
        imageContainer.addEventListener('dragstart', updateZoomControls);
        imageContainer.addEventListener('drag', updateZoomControls);
        imageContainer.addEventListener('dragend', updateZoomControls);
        updateZoomControls();

        zoomInButton?.addEventListener("click", () => {
            scale += scaleStep;
            image.style.transform = `scale(${scale})`;
            updateMarkers();
        });

        zoomOutButton?.addEventListener("click", () => {
            scale = Math.max(1, scale - scaleStep);
            image.style.transform = `scale(${scale})`;
            updateMarkers();
            updateZoomControls();
        });

        fullscreenButton?.addEventListener("click", () => {
            if (document.fullscreenElement) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozExitFullscreen) {
                    document.mozExitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (imageContainer.requestFullscreen) {
                    imageContainer.requestFullscreen();
                } else if (imageContainer.mozRequestFullScreen) {
                    imageContainer.mozRequestFullScreen();
                } else if (imageContainer.webkitRequestFullscreen) {
                    imageContainer.webkitRequestFullscreen();
                } else if (imageContainer.msRequestFullscreen) {
                    imageContainer.msRequestFullscreen();
                }
            }
        });

        imageContainer.addEventListener("fullscreenchange", () => {
            if (document.fullscreenElement) {
                document.addEventListener("keydown", handleFullscreenZoom);
                marksContainer.style.position = "absolute";
                marksContainer.style.height = image.clientHeight + "px";
            } else {
                document.removeEventListener("keydown", handleFullscreenZoom);
                marksContainer.style.position = "static";
                marksContainer.style.height = "100%";
                if (scrollIntoView === 'true') {
                    imageContainer.scrollIntoView();
                    imageContainer.dispatchEvent(eventAfterScrollIntoView);
                }
            }
            updateZoomControls();
            updateMarkers();
        });

        const handleFullscreenZoom = (event) => {
            const scrollAmount = 50;
            switch (event.key) {
                case "+":
                    scale += scaleStep;
                    break;
                case "-":
                    scale = Math.max(1, scale - scaleStep);
                    break;
                case "ArrowUp":
                    imageContainer.scrollTop -= scrollAmount;
                    break;
                case "ArrowDown":
                    imageContainer.scrollTop += scrollAmount;
                    break;
                case "ArrowLeft":
                    imageContainer.scrollLeft -= scrollAmount;
                    break;
                case "ArrowRight":
                    imageContainer.scrollLeft += scrollAmount;
                    break;
                default:
                    return;
            }

            image.style.transform = `scale(${scale})`;
            updateMarkers();
        };

        // Pan functionality
        let isPanning = false;
        let startX, startY, scrollLeft, scrollTop;

        imageContainer.addEventListener("mousedown", (e) => {
            if (showZoom !== '1') {
                return;
            }
            isPanning = true;
            imageContainer.classList.add("panning");
            startX = e.pageX - imageContainer.offsetLeft;
            startY = e.pageY - imageContainer.offsetTop;
            scrollLeft = imageContainer.scrollLeft;
            scrollTop = imageContainer.scrollTop;
        });

        imageContainer.addEventListener("mouseup", () => {
            isPanning = false;
            imageContainer.classList.remove("panning");
        });

        imageContainer.addEventListener("mouseleave", () => {
            isPanning = false;
            imageContainer.classList.remove("panning");
        });

        imageContainer.addEventListener("mousemove", (e) => {
            if (!isPanning) return;
            e.preventDefault();
            const x = e.pageX - imageContainer.offsetLeft;
            const y = e.pageY - imageContainer.offsetTop;
            const walkX = (x - startX) * 1;
            const walkY = (y - startY) * 1;
            imageContainer.scrollLeft = scrollLeft - walkX;
            imageContainer.scrollTop = scrollTop - walkY;
            updateZoomControls();
        });

        // touch event listeners for mobile zoom and pan functionality
        imageContainer.addEventListener("touchstart", (e) => {
            if (showZoom !== '1') {
                return;
            }
            if (e.touches.length === 2) {
                initialPinchDistance = getPinchDistance(e.touches);
                lastScale = scale;
            } else if (e.touches.length === 1) {
                isPanning = true;
                startX = e.touches[0].pageX - imageContainer.offsetLeft;
                startY = e.touches[0].pageY - imageContainer.offsetTop;
                scrollLeft = imageContainer.scrollLeft;
                scrollTop = imageContainer.scrollTop;
            }
        });

        imageContainer.addEventListener("touchmove", (e) => {
            if (e.touches.length === 2 && initialPinchDistance) {
                e.preventDefault();
                const currentDistance = getPinchDistance(e.touches);
                const pinchScale = currentDistance / initialPinchDistance;
                scale = Math.max(1, lastScale * pinchScale);
                image.style.transform = `scale(${scale})`;
                updateMarkers();
            } else if (isPanning && e.touches.length === 1) {
                // Handle panning
                e.preventDefault();
                const x = e.touches[0].pageX - imageContainer.offsetLeft;
                const y = e.touches[0].pageY - imageContainer.offsetTop;
                const walkX = (x - startX) * 1;
                const walkY = (y - startY) * 1;
                imageContainer.scrollLeft = scrollLeft - walkX;
                imageContainer.scrollTop = scrollTop - walkY;
                updateZoomControls();
            }
        });

        imageContainer.addEventListener("touchend", () => {
            isPanning = false;
            initialPinchDistance = null;
        });

        const getPinchDistance = (touches) => {
            const [touch1, touch2] = touches;
            const dx = touch2.pageX - touch1.pageX;
            const dy = touch2.pageY - touch1.pageY;
            return Math.sqrt(dx * dx + dy * dy);
        };

        // Change image cutout for resized images (height <= 512px)
        const setImageCutOut = function() {
            const cutOut = vncInteractiveImage.dataset['cutOut'];
            if (cutOut === undefined || cutOut === 'false') {
                return;
            }

            const interactiveImageContainer = image.closest('.vncInteractiveImageContainer');
            const imageContainer = image.closest('.image-container');
            if (!interactiveImageContainer) {
                return;
            }

            const rearrange = function() {
                const containerWidth = interactiveImageContainer.scrollWidth;
                const imgWidth = parseInt(image.getAttribute('width'));
                const imgHeight = parseInt(image.getAttribute('height'));

                const ratio = containerWidth / imgWidth;
                const calcedHeight = imgHeight * ratio;

                if (calcedHeight <= 512) {
                    image.classList.add('mobile');
                    imageContainer.classList.add('overflow-x');
                } else {
                    image.classList.remove('mobile');
                    imageContainer.classList.remove('overflow-x');
                }
            }
            window.addEventListener('resize', rearrange);
            rearrange();
        };
        setImageCutOut();
    });

    vncInteractiveImageContainers.forEach((vncInteractiveImageContainer, vncIndex) => {
        const select = vncInteractiveImageContainer.querySelector('select');

        if (!select) {
            return;
        }

        const selectUi = select.nextElementSibling;
        const selectButton = selectUi.querySelector('button');
        const selectUiCaption = selectUi?.querySelector('.caption');
        const selectUiIcon = selectUi?.querySelector('.svg-icon');
        const selectUl = vncInteractiveImageContainer.querySelector('ul.dropdown-menu');
        const selectListElements = selectUl?.querySelectorAll('li');
        const buttons = vncInteractiveImageContainer.querySelectorAll('.vncInteractiveImageContainer button[data-bs-toggle="collapse"]');

        let selectedIndex = 0;

        if (selectUiCaption) {
            selectUiCaption.innerText = selectListElements[0]?.innerText;
        }

        selectUiCaption?.addEventListener('click', (e) => {
            toggleSelectBox();
        });

        selectUiIcon?.addEventListener('click', (e) => {
            toggleSelectBox();
        });

        selectListElements?.forEach((el) => {
            el.addEventListener('click', (e) => {
                const a = el.querySelector('a');
                const index = parseInt(a.dataset['index']);

                if (index === selectedIndex) {
                    return;
                }

                selectUiCaption.innerText = e.target.innerText;
                toggleSelectBox();
                buttons.forEach(el => {
                    el.removeAttribute('disabled');
                });
                buttons[index].click();
                buttons[index].setAttribute('disabled', 'disabled');
                selectUiCaption.innerText = e.target.innerText
                selectedIndex = index;
            });
        });

        buttons?.forEach((button, index) => {
            if (!button.classList.contains('collapsed')) {
                button.setAttribute('disabled', 'disabled');
                button.setAttribute('aria-expanded', 'true');
            }
            button.addEventListener('click', (e) => {
                selectedIndex = index;
                buttons.forEach(el => {
                    el.removeAttribute('disabled');
                });
                e.target.setAttribute('disabled', 'disabled');
                if (selectUiCaption) {
                    selectUiCaption.innerText = e.target.innerText;
                }
            });
        });

        function toggleSelectBox() {
            selectUl?.classList.toggle('visually-hidden');
            selectUiIcon.classList.toggle('open');
        }

        selectButton.addEventListener('keypress', (e) => {
            toggleSelectBox();
        });
    });

    const setConsecutiveNumbering = () => {
        vncInteractiveImageContainers.forEach((interactiveImageContainer) => {
            const consecutiveNumbering = interactiveImageContainer.dataset['consecutiveNumbering'];
            if (consecutiveNumbering !== '1') {
                return;
            }

            let number = 1;
            interactiveImageContainer.querySelectorAll('.vncInteractiveImage')?.forEach((interactiveImage) => {
                const marks = interactiveImage.querySelectorAll('.image-container .marks-container > .mark > p.mark-icon--number');
                const popOverMarks = interactiveImage.querySelectorAll('.image-container .marks-container .mark > .content-box .mark-icon--number');
                const popOverInfoBoxMarks = interactiveImage.querySelectorAll('div > div > .content-box__info .mark-icon--number');
                const infoBoxMarks = interactiveImage.querySelectorAll('.container > div > div > .content-box .mark-icon--number');

                for (let i = 0; i < marks.length; i++) {
                    if (marks[i]) {
                        if (marks[i].childNodes.length === 1) {
                            marks[i].innerHTML = number;
                        } else {
                            marks[i].childNodes[marks[i].childNodes.length - 1].data = number;
                        }
                    }
                    if (popOverMarks[i]) {
                        if (popOverMarks[i].childNodes.length === 1) {
                            popOverMarks[i].innerHTML = number;
                        } else {
                            popOverMarks[i].childNodes[popOverMarks[i].childNodes.length - 1].data = number;
                        }
                    }
                    if (popOverInfoBoxMarks[i]) {
                        if (popOverInfoBoxMarks[i].childNodes.length === 1) {
                            popOverInfoBoxMarks[i].innerHTML = number;
                        } else {
                            popOverInfoBoxMarks[i].childNodes[popOverInfoBoxMarks[i].childNodes.length - 1].data = number;
                        }
                    }
                    if (infoBoxMarks[i]) {
                        if (infoBoxMarks[i].childNodes.length === 1) {
                            infoBoxMarks[i].innerHTML = number;
                        } else {
                            infoBoxMarks[i].childNodes[infoBoxMarks[i].childNodes.length - 1].data = number;
                        }
                    }

                    number++;
                }
            });
        });
    }
    setConsecutiveNumbering();
});
