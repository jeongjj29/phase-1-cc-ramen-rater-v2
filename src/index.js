// index.js
const ramenMenuDiv = document.querySelector("#ramen-menu");
const ramenDetailDiv = document.querySelector("#ramen-detail");
const ramenDetailImg = document.querySelector(".detail-image");
const ramenDetailNameH2 = document.querySelector(".name");
const ramenDetailRestaurantH3 = document.querySelector(".restaurant");
const ratingSpan = document.querySelector("#rating-display");
const commentDisplayP = document.querySelector("#comment-display");
const newRamenForm = document.querySelector("#new-ramen");

// Callbacks
const handleClick = (ramen) => {
  fetch(`http://localhost:3000/ramens/${ramen}`)
  .then(res => res.json())
  .then(ramenData => {
    ramenDetailImg.src = ramenData.image;
    ramenDetailNameH2.textContent = ramenData.name;
    ramenDetailRestaurantH3.textContent = ramenData.restaurant;
    ratingSpan.textContent = ramenData.rating;
    commentDisplayP.textContent = ramenData.comment;
    createUpdateRamenForm(ramen);
    createDeleteBtn(ramen);
  })
};

const addSubmitListener = () => {
  newRamenForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    fetch("http://localhost:3000/ramens", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name: newRamenForm.name.value,
        restaurant: newRamenForm.restaurant.value,
        image: newRamenForm.image.value,
        rating: newRamenForm.rating.value,
        comment: newRamenForm["new-comment"].value
      })
    })
    .then(() => {
      displayRamens();
    })
  })
}

const displayRamens = () => {
  fetch("http://localhost:3000/ramens")
  .then(res => res.json())
  .then(ramens => {
    ramenMenuDiv.innerHTML = "";
    ramens.forEach((ramen) => {
      const ramenImg = document.createElement("img");
      ramenImg.src = ramen.image;
      ramenImg.addEventListener("click", () => {handleClick(ramen.id)})
      
      ramenMenuDiv.append(ramenImg);


    })
    handleClick(ramens[0].id);
  })
};

const createUpdateRamenForm = (ramenId) => {
  if (document.querySelector("#edit-ramen")) {
    document.querySelector("#edit-ramen").remove();
  }

  const updateRamenForm = document.createElement("form");
  updateRamenForm.id = "edit-ramen";

  const updateRamenH4 = document.createElement("h4");
  updateRamenH4.textContent = "Update the Featured Ramen";

  const ratingLabel = document.createElement("label");
  ratingLabel.setAttribute("for", "rating");
  ratingLabel.textContent = "Rating: ";

  const ratingInput = document.createElement("input");
  ratingInput.type = "number";
  ratingInput.name = "rating";
  ratingInput.id = "new-rating";

  const commentLabel = document.createElement("label");
  commentLabel.setAttribute("for", "new-comment");
  commentLabel.textContent = "Comment: ";

  const commentTextarea = document.createElement("textarea");
  commentTextarea.name = "new-comment";
  commentTextarea.id = "new-comment";

  const submitInput = document.createElement("input");
  submitInput.type = "submit";
  submitInput.value = "Update";

  updateRamenForm.append(updateRamenH4, ratingLabel, ratingInput, commentLabel, commentTextarea, submitInput);
  updateRamenForm.addEventListener("submit", event => {
    event.preventDefault();

    fetch(`http://localhost:3000/ramens/${ramenId}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        rating: updateRamenForm.rating.value,
        comment: updateRamenForm["new-comment"].value
      })
    })

  })

  document.body.insertBefore(updateRamenForm, newRamenForm);
}

const createDeleteBtn = (ramenId) => {
  if (document.querySelector("#delete-button")) {
    document.querySelector("#delete-button").remove();
  }
  const deleteButton = document.createElement("button");
  deleteButton.id = "delete-button";
  deleteButton.textContent = "Delete the Featured Ramen";
  deleteButton.style.cssText = `
    width: 300px;
    padding: 0.25rem;
    margin: 0.5rem 0;
    color: white;
    background-color: black;
    font-size: 1rem;  
  `

  deleteButton.addEventListener("click", () => {
    handleDeleteButton(ramenId);
  })
  document.body.insertBefore(deleteButton, newRamenForm)
}

const handleDeleteButton = (ramenId) => {
  fetch(`http://localhost:3000/ramens/${ramenId}`, {
    method: "DELETE",
    headers: {"Content-Type": "application/json"}
  })
  .then(() => {
    displayRamens();
  })
}

const main = () => {
  displayRamens();
  addSubmitListener();
}

main()

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};
