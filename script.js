// document.addEventListener('DOMContentLoaded', function() {

// document.getElementById('memeForm').addEventListener('submit',function(event) {
//     event.preventDefault();
//     const imageURl = document.getElementById('imageURl');
//     const topText = document.getElementById('topText');
//     const bottomText = document.getElementById('bottomText');


  
// });

// });

// const memeContainer = document.getElementById('memeContainer');
// const memeForm = document.getElementById('memeForm');

// memeForm.addEventListener('submit', handleFormSubmit);

// // Event  for delete button
// memeContainer.addEventListener('click', function(e) {
//     if (e.target && e.target.classList.contains('delete-button')) {
//         handleDelete(e);
//     }
// });

// function handleFormSubmit(e) {
//     e.preventDefault();
    
//     const url = e.target.imageURL.value;
//     const topText = e.target.topText.value;
//     const bottomText = e.target.bottomText.value;

//     // Create a div with class "meme"
//     const memeDiv = document.createElement('div');
//     memeDiv.classList.add('meme');

//     // Create an image with the URL as a source
//     const image = document.createElement('img');
//     image.src = url;
//     image.alt = 'Meme Image';

//     // Create top and bottom text elements
//     const topTextElement = document.createElement('p');
//     topTextElement.classList.add('top');
//     topTextElement.textContent = topText;

//     const bottomTextElement = document.createElement('p');
//     bottomTextElement.classList.add('bottom');
//     bottomTextElement.textContent = bottomText;

//     // Create a delete button
//     const deleteButton = document.createElement('button');
//     deleteButton.textContent = 'Delete';
//     deleteButton.classList.add('delete-button');

//     // Append the image, text elements, and delete button to the meme div
//     memeDiv.appendChild(image);
//     memeDiv.appendChild(topTextElement);
//     memeDiv.appendChild(bottomTextElement);
//     memeDiv.appendChild(deleteButton);

//     // Append the meme div to the memeContainer
//     memeContainer.appendChild(memeDiv);

//     // Clear the input fields
//     e.target.imageURL.value = '';
//     e.target.topText.value = '';
//     e.target.bottomText.value = '';
// }

// function handleDelete(e) {
   
//     const memeDiv = e.target.closest('.meme');
//     if (memeDiv) {
//         memeDiv.remove();
//     }
// }
document.getElementById('memeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const imageURL = document.getElementById('imageURL').value;
    const topText = document.getElementById('topText').value;
    const bottomText = document.getElementById('bottomText').value;

    if (imageURL) {
        const memeDiv = document.createElement('div');
        memeDiv.classList.add('meme');

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('meme-content');

        const img = new Image();
        img.src = imageURL;

        img.onload = function() {
            imgContainer.appendChild(img);

            // Create and append top text
            if (topText) {
                const topTextDiv = document.createElement('div');
                topTextDiv.classList.add('top-text');
                topTextDiv.textContent = topText;
                imgContainer.appendChild(topTextDiv);
            }

            // Create and append bottom text
            if (bottomText) {
                const bottomTextDiv = document.createElement('div');
                bottomTextDiv.classList.add('bottom-text');
                bottomTextDiv.textContent = bottomText;
                imgContainer.appendChild(bottomTextDiv);
            }

            memeDiv.appendChild(imgContainer);

            // Create and append delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', function(e) {
                memeDiv.remove();
            });
            memeDiv.appendChild(deleteButton);

            // Append meme to container
            document.getElementById('memeContainer').appendChild(memeDiv);
        };

        img.onerror = function() {
            alert('Failed to load image. Please check the URL and try again.');
        };
    }
});
