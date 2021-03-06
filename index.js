const API = "https://60a3de2a7c6e8b0017e281a7.mockapi.io/puppy/";
const url = "https://api.cloudinary.com/v1_1/dogcmulpu/image/upload";
const containerPuppies = document.querySelector(".cardContainer");
const form = document.querySelector("#formulario1");
const addButton = document.querySelector("#addButton");
const showHide = document.querySelector("#agregar");
var timeagoInstance = timeago();
/*===============================================
Obtener datos de Mockapi y cargarlos en la pagina
===============================================*/
fetch(API)
  .then((response) => response.json())
  .then((data) => {
    /*===============================================
Iterar por la informacion para mostrarla
===============================================*/
    for (const puppy of data.reverse()) {
      containerPuppies.insertAdjacentHTML(
        "beforeend",
        `<div class='card'>
          <div class="info">
            <h2>${puppy.name}<br><span>${puppy.years} años</span></h2>
              <p><b>Especie:</b> ${puppy.race}</p>
              <p>${puppy.desc}</p>
              <p>${timeagoInstance.format(puppy.date)}</p>
          </div>
          <div class="picture">
          <img src=${puppy.image} alt="" />
          </div>
          <div class="gradient"></div>
        </div>`
      );
    }

    const cards = Array.from(document.querySelectorAll(".card"));
    cards.forEach((card) =>
      card.addEventListener("click", (e) => {
        card.classList.toggle("lightboxCard");
        document.querySelector(".lightbox").classList.toggle("lightboxActive");
      })
    );
  });

/*===============================================
Enviar formulario
===============================================*/
form.addEventListener("submit", (e) => {
  e.preventDefault();
  /*===============================================
Obtener imagen y subirla a Cloudinary
===============================================*/
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
        /*==================================================================
Una vez subida la imagen se obtiene la URL y se manda todo a Mockapi
==================================================================*/
        let imgData = JSON.parse(data);

        let dataSchema = {
          name: form["name"].value,
          years: form["years"].value,
          race: form["race"].value,
          desc: form["desc"].value,
          image: imgData.secure_url,
          date: new Date(),
        };

        fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataSchema),
        }).then((response) => {
          /*==============================================
Reseteamos el formulario y se recarga la pagina
==============================================*/
          form.reset();
          location.reload();
        });
      });
  }
});

/*===============================================
Evento para menu agregar nueva mascota
===============================================*/
addButton.addEventListener("click", () => {
  showHide.classList.toggle("showHide");
  addButton.classList.toggle("rotate");
});

/*===============================================
Modo Oscuro
===============================================*/
let button = document.querySelector("#dark-mode");

button.addEventListener("click", () => {
  let audio = new Audio("./assets/Light_Switch.mp3");
  audio.play();
  document.documentElement.classList.toggle("dark-mode");
  document.querySelector("#dark-mode").classList.toggle("dark-mode-active");
  document.querySelector("#agregar").classList.toggle("dark-mode");

  const cardsInvert = Array.from(
    document.querySelectorAll(".cardContainer img")
  );
  cardsInvert.forEach((cardInvert) => cardInvert.classList.toggle("dark-mode"));
});
