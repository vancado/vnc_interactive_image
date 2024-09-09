document.addEventListener("DOMContentLoaded", () => {
  const markers = document.querySelectorAll(".mark");
  const container = document.querySelector(".container[data-layout]");
  const layout = container ? container.dataset.layout : "popover";
  const image = document.querySelector(".img-fluid");

  const infoItems = document.querySelectorAll(".info-item");
  let currentIndex = 0;

  const showCurrentInfoItem = () => {
    infoItems.forEach((item, index) => {
      item.classList =
        index === currentIndex
          ? "info-item d-flex flex-column flex-grow-1"
          : "d-none";
      item.classList.toggle("active", index === currentIndex);

      const navPoints = item.querySelectorAll(".nav-point");
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
    infoItems.forEach((item, itemIndex) => {
      const navPointsContainer = item.querySelector(".nav-points");
      navPointsContainer.innerHTML = "";

      infoItems.forEach((_, pointIndex) => {
        const point = document.createElement("div");
        point.classList.add("nav-point");
        point.dataset.index = pointIndex;

        point.addEventListener("click", () => {
          currentIndex = pointIndex;
          showCurrentInfoItem();
        });

        navPointsContainer.appendChild(point);
      });

      if (itemIndex === 0) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
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
      const currentlyActivePopover = document.querySelector(
        ".content-box__popover .active"
      );
      if (currentlyActivePopover && currentlyActivePopover !== marker) {
        currentlyActivePopover.classList.remove("active");
        const previousMarker = currentlyActivePopover.closest(".mark");
        if (previousMarker) {
          previousMarker.classList.remove("active");
        }
      }

      const popover = document.getElementById(`popover-${markerId}`);
      if (popover) {
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

  const prevButton = document.querySelector(".nav-prev");
  if (prevButton) {
    prevButton.addEventListener("click", showPreviousItem);
  }

  const nextButton = document.querySelector(".nav-next");
  if (nextButton) {
    nextButton.addEventListener("click", showNextItem);
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest(".popover__close")) {
      const popover = document.querySelector(".content-box__popover.active");
      if (popover) {
        const marker = popover.closest(".mark");
        if (marker) {
          marker.classList.remove("active");
        }
        popover.classList.remove("active");
      }
    }

    if (
      !event.target.closest(".mark") &&
      !event.target.closest(".content-box__popover")
    ) {
      const currentlyActivePopover = document.querySelector(
        ".content-box__popover.active"
      );
      if (currentlyActivePopover) {
        currentlyActivePopover.classList.remove("active");
        const previousMarker = currentlyActivePopover.closest(".mark");
        if (previousMarker) {
          previousMarker.classList.remove("active");
        }
      }
    }
  });

  // Zoom and Pan Logic
  const zoomInButton = document.getElementById("zoom-in");
  const zoomOutButton = document.getElementById("zoom-out");
  const fullscreenButton = document.getElementById("fullscreen");
  const imageContainer = document.querySelector(".image-container");

  // Disable dragging of the image
  image.setAttribute("draggable", false);

  let scale = 1;
  const scaleStep = 0.1;

  const updateMarkers = () => {
    markers.forEach((marker) => {
      marker.style.transform = `scale(${scale})`;
    });
  };

  if (zoomInButton) {
    zoomInButton.addEventListener("click", () => {
      scale += scaleStep;
      image.style.transform = `scale(${scale})`;
      updateMarkers();
    });
  }

  if (zoomOutButton) {
    zoomOutButton.addEventListener("click", () => {
      scale = Math.max(1, scale - scaleStep);
      image.style.transform = `scale(${scale})`;
      updateMarkers();
    });
  }

  if (fullscreenButton) {
    fullscreenButton.addEventListener("click", () => {
      if (imageContainer.requestFullscreen) {
        imageContainer.requestFullscreen();
      } else if (imageContainer.mozRequestFullScreen) {
        imageContainer.mozRequestFullScreen();
      } else if (imageContainer.webkitRequestFullscreen) {
        imageContainer.webkitRequestFullscreen();
      } else if (imageContainer.msRequestFullscreen) {
        imageContainer.msRequestFullscreen();
      }
    });
  }

  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
      document.addEventListener("keydown", handleFullscreenZoom);
    } else {
      document.removeEventListener("keydown", handleFullscreenZoom);
    }
  });

  const handleFullscreenZoom = (event) => {
    if (event.key === "+") {
      scale += scaleStep;
    } else if (event.key === "-") {
      scale = Math.max(1, scale - scaleStep);
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
});
