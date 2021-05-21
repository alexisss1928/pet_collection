const API = "https://60a3de2a7c6e8b0017e281a7.mockapi.io/puppy/";
const url = "https://api.cloudinary.com/v1_1/dogcmulpu/image/upload";
const containerPuppies = document.querySelector(".cardContainer");
const form = document.querySelector("#formulario1");
const addButton = document.querySelector("#addButton");
const showHide = document.querySelector("#agregar");

fetch(API)
  .then((response) => response.json())
  .then((data) => {
    for (const puppy of data) {
      containerPuppies.insertAdjacentHTML(
        "beforeend",
        `<div class='card'>
          <div class="info">
            <h2>${puppy.name}</h2>
              <p>${puppy.years} años</p>
              <p>${puppy.race}</p>
          </div>
          <div class="picture" style="background-image: linear-gradient(
            69deg,
            rgba(224, 224, 224, 1) 0%,
            rgba(224, 224, 224, 1) 20%,
            rgba(224, 224, 224, 0) 100%
          ),
          url(${puppy.image});">
            
          </div>
        </div>`
      );
    }
  });

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const files = document.querySelector("[type=file]").files;
  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    formData.append("file", file);
    formData.append("upload_preset", "ywrbw9wp");

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        let imgData = JSON.parse(data);

        let dataSchema = {
          name: form["name"].value,
          years: form["years"].value,
          race: form["race"].value,
          image: imgData.secure_url,
        };

        fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataSchema),
        }).then((response) => {
          location.reload();
        });
      });
  }
});

addButton.addEventListener("click", () => {
  showHide.classList.toggle("showHide");
  addButton.classList.toggle("rotate");
});
