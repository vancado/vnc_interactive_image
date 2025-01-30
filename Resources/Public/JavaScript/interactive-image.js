document.addEventListener("DOMContentLoaded", () => {
  const vncInteractiveImages = document.querySelectorAll('.vncInteractiveImage');
  const eventAfterShowMobilePopover = new Event('afterShowMobilePopover');
  const eventAfterHidePopover = new Event('afterHidePopover');
  const eventAfterPositioning = new Event('afterPositioning');

  vncInteractiveImages.forEach(vncInteractiveImage => {
    const markers = vncInteractiveImage.querySelectorAll(".mark");
    const container = vncInteractiveImage.querySelector(".container[data-layout]");
    const marksContainer = vncInteractiveImage.querySelector(".marks-container");
    const layout = container ? container.dataset.layout : "popover";
    const showZoom = vncInteractiveImage?.dataset.showZoom;
    const image = vncInteractiveImage.querySelector(".img-fluid");
    const infoItems = vncInteractiveImage.querySelectorAll(".info-item");
    const navPointsContainer = vncInteractiveImage.querySelector(".nav-points");

    let currentIndex = 0;

    const showCurrentInfoItem = () => {
      infoItems.forEach((item, index) => {
        item.classList = index === currentIndex ? "info-item d-flex flex-column flex-grow-1" : "d-none";
        item.classList.toggle("active", index === currentIndex);

        const navPoints = navPointsContainer.querySelectorAll(".nav-point");
        navPoints.forEach((point, pointIndex) => {
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
      navPointsContainer.innerHTML = "";

      infoItems.forEach((_, index) => {
        const point = document.createElement("div");
        point.classList.add("nav-point");
        point.dataset.index = index;

        point.addEventListener("click", () => {
          currentIndex = index;
          showCurrentInfoItem();
        });

        navPointsContainer.appendChild(point);
      });

      showCurrentInfoItem();
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
        const currentlyActivePopover = vncInteractiveImage.querySelector(".content-box__popover.active");
        if (currentlyActivePopover && currentlyActivePopover !== marker) {
          currentlyActivePopover.classList.remove("active");
          const previousMarker = currentlyActivePopover.closest(".mark");
          if (previousMarker) {
            previousMarker.classList.remove("active");
          }
        }

        const popover = vncInteractiveImage.querySelector(`#${markerId}`);
        console.log(markerId)
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
          const y1 = Math.round((vncInteractiveImageRect.height - popoverRect.height) / 2);
          const y2 = parseInt(marker.style.top);
          popover.style.top = (y1 - y2) + "px";

          const isMobile = window.matchMedia("(max-width: 1024px)").matches;
          if (isMobile) {
            popover.classList.remove("top", "bottom", "left", "right");
            // document.querySelectorAll('.content-box__image').forEach(el => el.remove());
            if (document.fullscreenElement) {
              popover.style.bottom = "0";
              popover.style.right = "0";

              if (popover.parentNode !== imageContainer) {
                imageContainer.parentNode.prepend(popover);
              }
            } else {
              popover.style = null;
              imageContainer.append(popover);
              popover.dispatchEvent(eventAfterShowMobilePopover);
            }
          } else {
            if (popover.parentNode === imageContainer) {
              marker.querySelector('.mark-title').after(popover);
            }
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
        imageContainer.prepend(zoomControls);
      }
    };

    imageContainer.addEventListener('scrollstart', updateZoomControls);
    imageContainer.addEventListener('scroll', updateZoomControls);
    imageContainer.addEventListener('scrollend', updateZoomControls);
    imageContainer.addEventListener('dragstart', updateZoomControls);
    imageContainer.addEventListener('drag', updateZoomControls);
    imageContainer.addEventListener('dragend', updateZoomControls);

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

    document.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) {
        document.addEventListener("keydown", handleFullscreenZoom);
        marksContainer.style.position = "absolute";
        marksContainer.style.height = image.clientHeight + "px";
      } else {
        document.removeEventListener("keydown", handleFullscreenZoom);
        marksContainer.style.position = "static";
        marksContainer.style.height = "100%";
        imageContainer.scrollIntoView();
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
        const currentDistance = getPinchDistance(e.touches);
        const pinchScale = currentDistance / initialPinchDistance;
        scale = Math.max(1, lastScale * pinchScale);
        image.style.transform = `scale(${scale})`;
        updateMarkers();
      } else if (isPanning && e.touches.length === 1) {
        // Handle panning
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

  });

});
