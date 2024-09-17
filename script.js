document
  .getElementById("memeForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const imageURL = document.getElementById("imageURL").value;
    const topText = document.getElementById("topText").value;
    const bottomText = document.getElementById("bottomText").value;

    if (imageURL) {
      const memeDiv = document.createElement("div");
      memeDiv.classList.add("meme");

      const imgContainer = document.createElement("div");
      imgContainer.classList.add("meme-content");

      const img = new Image();
      img.src = imageURL;

      imgContainer.appendChild(img);

      // Create and append top text
      if (topText) {
        const topTextDiv = document.createElement("div");
        topTextDiv.classList.add("top-text");
        topTextDiv.textContent = topText;
        imgContainer.appendChild(topTextDiv);
      }

      // Create and append bottom text
      if (bottomText) {
        const bottomTextDiv = document.createElement("div");
        bottomTextDiv.classList.add("bottom-text");
        bottomTextDiv.textContent = bottomText;
        imgContainer.appendChild(bottomTextDiv);
      }

      memeDiv.appendChild(imgContainer);

      // Create and append delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("delete-button");
      deleteButton.addEventListener("click", (e)=>  memeDiv.remove());

      
      memeDiv.appendChild(deleteButton);

      // Append meme to container
      document.getElementById("memeContainer").appendChild(memeDiv);

      
    }
  });
