const memeTemplates = [
  { name: "Template 1", url: "https://via.placeholder.com/400x300.png?text=Template+1" },
  { name: "Template 2", url: "https://via.placeholder.com/300x400.png?text=Template+2" },
  { name: "Template 3", url: "https://via.placeholder.com/350x350.png?text=Template+3" },
];

function loadTemplates() {
  const container = document.getElementById('memeTemplatesContainer');
  if (!container) return; 

  memeTemplates.forEach(template => {
    const imgThumb = document.createElement('img');
    imgThumb.src = template.url;
    imgThumb.alt = template.name;
    imgThumb.title = template.name;
    imgThumb.addEventListener('click', () => {
      document.getElementById('imageURL').value = template.url;
      const imageUploadInput = document.getElementById('imageUpload');
      if (imageUploadInput) {
        imageUploadInput.value = ""; 
      }
      document.getElementById('memeForm').scrollIntoView({ behavior: 'smooth' });
    });
    container.appendChild(imgThumb);
  });
}

function makeDraggable(element, boundsContainer) {
    let active = false;
    let initialX, initialY; // Mouse click position relative to viewport
    let xOffset = 0, yOffset = 0; // Offset from element's top-left corner to mouse click point

    element.addEventListener('mousedown', dragStart);
    element.addEventListener('touchstart', dragStart, { passive: false });

    function dragStart(e) {
        // e.preventDefault(); // Allow text input focus, etc. Only preventDefault in drag if needed.
                           // However, for touch, it's good to prevent scroll.
        if (e.type === 'touchstart') e.preventDefault();


        boundsContainer.classList.add('dragging'); 
        element.classList.add('dragging');

        // Calculate xOffset and yOffset: the point on the element where the mouse was clicked
        // For touch, e.touches[0].pageX/pageY is relative to the viewport.
        // element.getBoundingClientRect().left/top is also relative to the viewport.
        const elRect = element.getBoundingClientRect();
        if (e.type === 'touchstart') {
            xOffset = e.touches[0].clientX - elRect.left;
            yOffset = e.touches[0].clientY - elRect.top;
            initialX = e.touches[0].clientX; // Not strictly needed as we use offsets
            initialY = e.touches[0].clientY;
        } else {
            xOffset = e.clientX - elRect.left;
            yOffset = e.clientY - elRect.top;
            initialX = e.clientX;
        }
        
        // Ensure the element's position is relative to boundsContainer for accurate offsetLeft/Top
        // This should already be true if boundsContainer is the offsetParent.
        // The initial CSS positions top/bottom text with 'top' and 'bottom'. 
        // When dragging starts, we switch to explicit 'top' and 'left' in pixels.
        // Convert current position to explicit top/left if it's the first drag.
        if (!element.style.left) { // First drag, convert current position
            element.style.left = element.offsetLeft + 'px';
        }
        if (!element.style.top) {
             // For bottom-text, 'bottom' style might be active. Convert it.
            if (element.classList.contains('bottom-text') && element.style.bottom && element.style.bottom !== 'auto') {
                 element.style.top = element.offsetTop + 'px';
            } else if (!element.style.bottom || element.style.bottom === 'auto') {
                 // If top also not set, use offsetTop (it might be 0 or based on CSS)
                 element.style.top = element.offsetTop + 'px';
            }
        }
        if (element.classList.contains('bottom-text')) {
            element.style.bottom = 'auto'; // Disable bottom positioning
        }
        element.style.transform = ''; // Clear initial centering transform

        active = true;
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);
    }

    function drag(e) {
        if (active) {
            e.preventDefault();
            let currentMouseX, currentMouseY;
            if (e.type === 'touchmove') {
                currentMouseX = e.touches[0].clientX;
                currentMouseY = e.touches[0].clientY;
            } else {
                currentMouseX = e.clientX;
                currentMouseY = e.clientY;
            }

            // Calculate the desired top-left corner of the element in viewport coordinates
            let desiredViewportX = currentMouseX - xOffset;
            let desiredViewportY = currentMouseY - yOffset;
            
            // Convert viewport coordinates to coordinates relative to the boundsContainer
            const boundsRect = boundsContainer.getBoundingClientRect();
            let newLeft = desiredViewportX - boundsRect.left;
            let newTop = desiredViewportY - boundsRect.top;

            // Constrain within boundsContainer
            newLeft = Math.max(0, Math.min(newLeft, boundsContainer.clientWidth - element.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, boundsContainer.clientHeight - element.offsetHeight));
            
            element.style.left = newLeft + 'px';
            element.style.top = newTop + 'px';
        }
    }

    function dragEnd() {
        active = false;
        boundsContainer.classList.remove('dragging');
        element.classList.remove('dragging');

        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('touchend', dragEnd);

        // Optional: Store final relative positions on dataset if needed elsewhere,
        // but offsetLeft/Top should be sufficient for canvas drawing.
        // element.dataset.finalX = element.offsetLeft;
        // element.dataset.finalY = element.offsetTop;
    }
}

document.getElementById("memeForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const imageUploadInput = document.getElementById("imageUpload");
    const imageURLInput = document.getElementById("imageURL");
    const topTextValue = document.getElementById("topText").value;
    const bottomTextValue = document.getElementById("bottomText").value;

    if (imageUploadInput.files && imageUploadInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            createMemeWithImage(e.target.result, topTextValue, bottomTextValue);
        };
        reader.onerror = function() { // Error handling for FileReader
            alert("Error reading file. Please try again.");
        };
        reader.readAsDataURL(imageUploadInput.files[0]);
        // imageURLInput.value = ""; // Clear URL input if a file is chosen - will be cleared by form.reset()
    } else if (imageURLInput.value) {
        createMemeWithImage(imageURLInput.value, topTextValue, bottomTextValue);
    } else {
        alert("Please provide an image URL or upload an image.");
    }
});

function createMemeWithImage(imageSrc, topTextStr, bottomTextStr) {
    if (!imageSrc) { // Should not happen if form validation is correct
        alert("No image source provided.");
        return;
    }

    const memeDiv = document.createElement("div");
    memeDiv.classList.add("meme");

    const imgContainer = document.createElement("div");
    imgContainer.classList.add("meme-content");

    const img = new Image();
    
    img.onload = () => {
        const addOutline = document.getElementById("textOutlineToggle").checked;

        const topFontFamily = document.getElementById('topFontFamily').value;
        const topFontSize = document.getElementById('topFontSize').value;
        const topFontColor = document.getElementById('topFontColor').value;

        const bottomFontFamily = document.getElementById('bottomFontFamily').value;
        const bottomFontSize = document.getElementById('bottomFontSize').value;
        const bottomFontColor = document.getElementById('bottomFontColor').value;

        // Create and append top text
        if (topTextStr) {
            const topTextDiv = document.createElement("div");
            topTextDiv.classList.add("top-text");
            if (!addOutline) {
                topTextDiv.classList.add("text-no-outline");
            }
            topTextDiv.style.fontFamily = topFontFamily;
            topTextDiv.style.fontSize = topFontSize + 'px';
            topTextDiv.style.color = topFontColor;
            topTextDiv.textContent = topTextStr;
            imgContainer.appendChild(topTextDiv);
            makeDraggable(topTextDiv, imgContainer);
        }

        // Create and append bottom text
        if (bottomTextStr) {
            const bottomTextDiv = document.createElement("div");
            bottomTextDiv.classList.add("bottom-text");
            if (!addOutline) {
                bottomTextDiv.classList.add("text-no-outline");
            }
            bottomTextDiv.style.fontFamily = bottomFontFamily;
            bottomTextDiv.style.fontSize = bottomFontSize + 'px';
            bottomTextDiv.style.color = bottomFontColor;
            bottomTextDiv.textContent = bottomTextStr;
            imgContainer.appendChild(bottomTextDiv);
            makeDraggable(bottomTextDiv, imgContainer);
        }
        
        memeDiv.appendChild(imgContainer); // Add the container with image and texts to the main meme div

        // Create and append delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", () => memeDiv.remove());
        memeDiv.appendChild(deleteButton);
        
        // Create and append download button
        const downloadButton = document.createElement("button");
        downloadButton.textContent = "Download";
        downloadButton.classList.add("download-button");
        downloadButton.addEventListener("click", () => {
            if (!img.complete || img.naturalWidth === 0) {
                alert("Image is still loading or failed to load. Please wait and try again.");
                return;
            }
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw image with explicit dimensions
            
            // Common settings for canvas text
            ctx.strokeStyle = "black"; // Outline color
            ctx.lineWidth = 4; // Outline width
            const addOutlineForDownload = document.getElementById("textOutlineToggle").checked;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top'; // Align Y to the top of the text div

            // Top text styles for canvas
            const canvasTopFontFamily = document.getElementById('topFontFamily').value;
            const canvasTopFontSize = document.getElementById('topFontSize').value;
            const canvasTopFontColor = document.getElementById('topFontColor').value;
            const topTextElement = imgContainer.querySelector('.top-text');

            if (topTextStr && topTextElement) {
                ctx.font = `bold ${canvasTopFontSize}px ${canvasTopFontFamily}`;
                ctx.fillStyle = canvasTopFontColor;
                
                const ttX = topTextElement.offsetLeft + topTextElement.offsetWidth / 2;
                const ttY = topTextElement.offsetTop;

                if (addOutlineForDownload) {
                    ctx.strokeText(topTextStr, ttX, ttY);
                }
                ctx.fillText(topTextStr, ttX, ttY);
            }

            // Bottom text styles for canvas
            const canvasBottomFontFamily = document.getElementById('bottomFontFamily').value;
            const canvasBottomFontSize = document.getElementById('bottomFontSize').value;
            const canvasBottomFontColor = document.getElementById('bottomFontColor').value;
            const bottomTextElement = imgContainer.querySelector('.bottom-text');

            if (bottomTextStr && bottomTextElement) {
                ctx.font = `bold ${canvasBottomFontSize}px ${canvasBottomFontFamily}`;
                ctx.fillStyle = canvasBottomFontColor;

                const btX = bottomTextElement.offsetLeft + bottomTextElement.offsetWidth / 2;
                const btY = bottomTextElement.offsetTop;
                                
                if (addOutlineForDownload) {
                    ctx.strokeText(bottomTextStr, btX, btY);
                }
                ctx.fillText(bottomTextStr, btX, btY);
            }

            const dataURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'meme.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
        memeDiv.appendChild(downloadButton);

        document.getElementById("memeContainer").appendChild(memeDiv);
        
        // Clear form fields after successful meme generation
        document.getElementById("memeForm").reset();
    };

    img.onerror = () => {
        alert("Failed to load image. Please check the URL or try a different file.");
        document.getElementById("memeForm").reset(); // Also reset form on image load error
    };
    
    imgContainer.appendChild(img); // Add image to its container
    img.src = imageSrc; // Set src to start loading image AFTER onload and onerror are attached
}

document.addEventListener('DOMContentLoaded', function() {
    loadTemplates(); 
});
