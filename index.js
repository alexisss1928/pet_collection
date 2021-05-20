const API = "https://60a3de2a7c6e8b0017e281a7.mockapi.io/puppy/";
const url = "https://api.cloudinary.com/v1_1/dogcmulpu/image/upload";
const containerPuppies = document.querySelector(".cardContainer");
const form = document.querySelector("#formulario1");

fetch(API)
  .then((response) => response.json())
  .then((data) => {
    for (const puppy of data) {
      containerPuppies.insertAdjacentHTML(
        "beforeend",
        `<div class='card'>
          <div class="info">
            <h3>${puppy.name}</h3>
            <ul>
              <li><b>Años:</b> ${puppy.years}</li>
              <li><b>Especie:</b> ${puppy.race}</li>
            </ul>
          </div>
          <div class="picture">
            <img src="${puppy.image}"/>
            
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
        })
          .then((response) => response.json())
          .then((response) => {
            location.reload();
          });
      });
  }
});
