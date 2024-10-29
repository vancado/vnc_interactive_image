document.addEventListener("DOMContentLoaded", () => {
  const markers = document.querySelectorAll(".mark");
  const container = document.querySelector(".container[data-layout]");
  const layout = container ? container.dataset.layout : "popover";
  const image = document.querySelector(".img-fluid");

  const infoItems = document.querySelectorAll(".info-item");
  const navPointsContainer = document.querySelector(".nav-points");
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


  const handleMarkerClick = (marker, markerId) => {
    if (layout === "infoBox") {
      infoItems.forEach((infoItem) => infoItem.classList.remove("active"));
      const infoItem = document.getElementById(markerId);
      if (infoItem) {
        currentIndex = Array.from(infoItems).indexOf(infoItem);
        showCurrentInfoItem();
      }
    } else {
      const currentlyActivePopover = document.querySelector(".content-box__popover.active");
      if (currentlyActivePopover && currentlyActivePopover !== marker) {
        currentlyActivePopover.classList.remove("active");
        const previousMarker = currentlyActivePopover.closest(".mark");
        if (previousMarker) {
          previousMarker.classList.remove("active");
        }
      }

      const popover = document.getElementById(`popover-${markerId}`);
      if (popover) {
        const popovers = document.querySelectorAll(".content-box__popover");
        const markerRect = marker.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        popover.classList.remove("top", "bottom", "left", "right");
        
        const markerCenterY = markerRect.top + markerRect.height / 2;
        const markerCenterX = markerRect.left + markerRect.width / 2;

        if (markerCenterY > window.innerHeight / 2) {
          popover.classList.add("top");
        } else {
          popover.classList.add("bottom");
        }

        if (markerCenterX > window.innerWidth / 2) {
          popover.classList.add("left");
        } else {
          popover.classList.add("right");
        }

        popover.classList.toggle("active");
        marker.classList.toggle("active");

        popovers?.forEach((item) => {
          if (item !== popover) {
            item.classList.remove("active");
            item.parentElement.classList.remove("active");
          }
        });
        markers?.forEach((item) => (item.style.zIndex = 1));
        marker.style.zIndex = 2;

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
      event.preventDefault();
      event.stopPropagation();
      handleMarkerClick(marker, markerId);
    });

    if (layout === "infoBox" && index === 0) {
      marker.click();
    }
  });

  if (infoItems.length > 0) {
    generateNavPoints();
  }

  const prevButtons = document.querySelectorAll(".nav-prev");
  if (prevButtons) {
    prevButtons.forEach((button) => {
      button.addEventListener("click", showPreviousItem);
    });
  }

  const nextButtons = document.querySelectorAll(".nav-next");
  if (nextButtons) {
    nextButtons.forEach((button) => {
      button.addEventListener("click", showNextItem);
    });
  }


  document.addEventListener("click", (event) => {
    const closeIcon = event.target.closest(".content-box__close");
    const activePopover = document.querySelector(".content-box__popover.active");
  
    if (closeIcon) {
      console.log("Popover close clicked");
      
      const popover = closeIcon.closest(".content-box__popover");
      if (popover) {
        const marker = popover.closest(".mark");
        if (marker) {
          marker.classList.remove("active");
        }
        popover.classList.remove("active");
      }
      return;
    }
  
    if (!event.target.closest(".mark") && !event.target.closest(".content-box__popover")) {
      console.log("Clicked outside of mark and popover");
  
      if (activePopover) {
        activePopover.classList.remove("active");
  
        const activeMarker = activePopover.closest(".mark");
        if (activeMarker) {
          activeMarker.classList.remove("active");
        }
      }
    }
  });
  
  // Zoom and Pan Logic
  const zoomControls = document.querySelector(".zoom-controls");
  const zoomInButton = document.getElementById("zoom-in");
  const zoomOutButton = document.getElementById("zoom-out");
  let initialPinchDistance = null;
  const fullscreenButton = document.getElementById("fullscreen");
  const imageContainer = document.querySelector(".image-container");
  const marksContainer = document.querySelector(".marks-container");
  const markersOriginalPosition = [];

  // Disable dragging of the image
  image.setAttribute("draggable", false);

  let scale = 1;
  const scaleStep = 0.1;

  const innerWidth = window.innerWidth;
  if(innerWidth<768) {
    scale = 1.4
  }

  markers.forEach((marker, i) => {
    markersOriginalPosition[i] = [parseInt(marker.style.left) / 100, parseInt(marker.style.top) / 100];
  });

  const updateMarkers = () => {
    markers.forEach((marker, i) => {
      console.log('MARKERSCALE', scale)
      marker.style.left = scale * markersOriginalPosition[i][0] * image.clientWidth + "px";
      marker.style.top = scale * markersOriginalPosition[i][1] * image.clientHeight + "px";
    });
  };

  window.addEventListener('load', updateMarkers);
  window.addEventListener('resize', updateMarkers);

  const updateZoomControls = () => {
    if (document.fullscreenElement) {
      zoomControls.style.position = "fixed";
      zoomControls.style.bottom = "10px";
      zoomControls.style.right = "10px";
      imageContainer.append(zoomControls);
    } else {
      zoomControls.style = null;
      imageContainer.parentNode.prepend(zoomControls);
    }
  };

  zoomInButton?.addEventListener("click", () => {
    scale += scaleStep;
    image.style.transform = `scale(${scale})`;
    updateMarkers();
  });

  zoomOutButton?.addEventListener("click", () => {
    scale = Math.max(1, scale - scaleStep);
    image.style.transform = `scale(${scale})`;
    updateMarkers();
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

  window.addEventListener("resize", () => {
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
  });

  // touch event listeners for mobile zoom and pan functionality
  imageContainer.addEventListener("touchstart", (e) => {
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
