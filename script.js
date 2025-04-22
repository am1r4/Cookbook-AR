// Modify your targetFound event handler like this:
sceneEl.addEventListener('targetFound', function(event) {
    const targetIndex = event.detail.targetIndex;
    debugEl.innerText = `Target ${targetIndex} found - Loading video...`;
    instructionsEl.style.display = 'none';
    
    // Get the appropriate video element
    const videoElement = targetIndex === 0 ? recipe1VideoEl : recipe2VideoEl;
    
    // Make sure video is loaded
    if (videoElement.readyState >= 2) {
      playVideo(videoElement, targetIndex);
    } else {
      // Add event listener for when enough data is loaded
      videoElement.addEventListener('canplaythrough', function onCanPlay() {
        videoElement.removeEventListener('canplaythrough', onCanPlay);
        playVideo(videoElement, targetIndex);
      });
      // Force load
      videoElement.load();
    }
  });
  
  // Add this helper function
  function playVideo(videoElement, targetIndex) {
    // Try to play with user gesture simulation
    const playPromise = videoElement.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        debugEl.innerText = `Video ${targetIndex} playing`;
      }).catch(error => {
        debugEl.innerText = `Video ${targetIndex} play error: ${error.message}`;
        // Try a different approach for iOS
        videoElement.muted = true; // Ensure muted
        videoElement.play().catch(e => {
          debugEl.innerText = `Still can't play: ${e.message}`;
        });
      });
    }
  }