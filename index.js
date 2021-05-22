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
          <div class="picture" style="background-image: linear-gradient(
            79deg,
            rgba(224, 224, 224, 1) 0%,
            rgba(224, 224, 224, 1) 20%,
            rgba(224, 224, 224, 0) 100%
          ),
          url(${puppy.image});">
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
