// Configure the form
DeBallenbak.onInit(() => {
    // Get the form
    let form = document.getElementById("form-message");
    let notifications = document.getElementById("form-message-notifications");
    let regexEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi;

    // Disable the dummy field
    document.getElementById("form-message-subject").style.display = "none";

    // Set button action
    let btn = form.querySelector("button[type=submit]");
    btn.disabled = false;
    btn.onclick = (e) => {
        // Prevent default
        e.preventDefault();

        // Disable the button
        btn.disabled = true;

        // Find values
        let name = document.getElementById("form-message-name").value;
        let email = document.getElementById("form-message-email").value;
        let message = document.getElementById("form-message-message").value;

        if (name.length < 2) {
            notifications.innerHTML = "";
            notifications.insertAdjacentHTML("afterbegin", `<div class="alert alert-warning" role="alert">Vul een naam in</div>`);

            btn.disabled = false;

            return;
        }
        if (!regexEmail.test(email)) {
            notifications.innerHTML = "";
            notifications.insertAdjacentHTML("afterbegin", `<div class="alert alert-warning" role="alert">Vul een geldig emailadres in</div>`);

            btn.disabled = false;

            return;
        }
        if (message.length < 2) {
            notifications.innerHTML = "";
            notifications.insertAdjacentHTML("afterbegin", `<div class="alert alert-warning" role="alert">Vul een bericht in</div>`);

            btn.disabled = false;

            return;
        }
        if (message.length > 2048) {
            notifications.innerHTML = "";
            notifications.insertAdjacentHTML("afterbegin", `<div class="alert alert-warning" role="alert">Bericht is te lang (` + message.length + `/2048 karakters)</div>`);

            btn.disabled = false;

            return;
        }

        // Post the form
        DeBallenbak.postForm("/forms/message", {
            name: name,
            email: email,
            message: message,
            subject: document.getElementById("form-message-subject").value
        }).then(
            () => {
                notifications.innerHTML = "";
                notifications.insertAdjacentHTML("afterbegin", `<div class="alert alert-success" role="alert">Bericht verstuurd, wij zullen zo snel mogelijk reageren</div>`);
            },
            () => {
                notifications.innerHTML = "";
                notifications.insertAdjacentHTML("afterbegin", `<div class="alert alert-danger" role="alert">Bericht niet verstuurd vanwege een onbekende fout in de website, neem contact met ons op via info@ballenbakeindhoven.nl</div>`);
            }
        );
    }
});


// Load facebook events
DeBallenbak.onInit(() => {
    // Display a message while waiting
    let elInsert = document.getElementById("agenda-insert");
    elInsert.innerHTML = `<p class="text-center">De agenda wordt geladen...</p>`;

    // Use API
    DeBallenbak.getJSON("/api/events").then(
        (events) => {
            elInsert.innerHTML = ``;
            for (let e of events) {
                let d = new Date(Date.parse(e.start_time));
                let t = d.toLocaleDateString() + "<br>" + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

                elInsert.insertAdjacentHTML("beforeend", `
                    <div class="row em-box">
                        <div class="col col-md-4 event-image-container">
                           <img class="event-image" src="`+e.cover.source+`">
                        </div>
                        <div class="col col-md-8">
                            <h3 class="event-name">`+e.name+`</h3>
                            <p class="event-time">`+t+`</p>
                            <p><a href="https://facebook.com/events/`+e.id+`">Meer informatie</a></p>
                        </div>
                    </div>
                `);
            }
        },
        () => {
            elInsert.innerHTML = `<p class="text-center">Er staan op dit moment geen evenementen in de agenda.</p>`;
        }
    )
});

// Load faceboot albums
DeBallenbak.onInit(() => {
    // Display a message while waiting
    let elInsert = document.getElementById("fotos-insert");
    elInsert.innerHTML = ``;

    // Initialize isotope
    let iso = new Isotope( elInsert, {
        itemSelector: ".album-container",
        percentPosition: true,
        layoutMode: "fitRows"
    });

    // Use API
    DeBallenbak.getJSON("/api/albums").then(
        (albums) => {
            elInsert.innerHTML = ``;
            for (let a of albums) {
                switch(a.name.toLowerCase()){
                    case "cover photos":
                    case "profile pictures":
                    case "timeline photos":
                    case "untitled album":
                        continue;
                }

                let e = document.createElement("div");
                e.dataset.albumId = a.id;
                e.className = "album-container text-left";
                e.innerHTML = `<div class="album-info"><h3 class="album-name">`+a.name+`</h3><p><a href="https://facebook.com/`+a.id+`">Naar album</a></p></div>`;

                iso.insert(e);

                DeBallenbak.getJSON("/api/albums/"+a.id).then(
                    (photos)=>{
                        e.insertAdjacentHTML("afterbegin", `<img class="album-photo" src="`+photos[0].source+`">`)

                        imagesLoaded( e ).on( "progress",()=> {
                            iso.layout();
                        });
                    },
                    ()=>{
                        console.error("Failed to load facebook album photo");
                    }
                )
            }
        },
        () => {
            elInsert.innerHTML = ``;
        }
    )
});