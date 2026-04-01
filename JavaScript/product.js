function showImage(index) {
  ImageTrackList.forEach((image, i) => {
    image.style.display = i === index ? "block" : "none";
  });
}

function slideImage(direction) {
  currentImageIndex += direction;
  if (currentImageIndex < 0) {
    currentImageIndex = ImageTrackList.length - 1;
  }
  if (currentImageIndex >= ImageTrackList.length) {
    currentImageIndex = 0;
  }
  showImage(currentImageIndex);
}

showImage(currentImageIndex);
