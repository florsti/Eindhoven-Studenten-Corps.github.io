class DeBallenbak {
    // Run function once the page is initialized
    static onInit(fn){
        if (document.readyState === "complete" || document.readyStatue === "interactive") {
            fn();
        } else {
            document.addEventListener("readystatechange", ()=>{
                if(document.readyState === "complete" || document.readyState === "interactive"){
                    fn();
                }
            });
        }
    }

    // Run function once the DOM has loaded
    static onLoad(fn) {
        if (document.readyState === "complete") {
            fn();
        } else {
            document.addEventListener("readystatechange", ()=>{
                if(document.readyState === "complete"){
                    fn();
                }
            });
        }
    }

    // Fadein effect for element
    static fadeIn(el) {
        el.style.opacity = 0;

        let last = +new Date();
        let tick = () => {
            el.style.opacity = +el.style.opacity + (new Date() - last) / 500;
            last = +new Date();

            if (+el.style.opacity < 1) {
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            }
        };

        tick();
    }

    // Get some JSON
    static getJSON(url) {
        return new Promise((resolve, reject) => {
            let r = new XMLHttpRequest();
            r.open("GET", url, true);
            r.onload = function () {
                if (r.status >= 200 && r.status < 400) {
                    resolve(JSON.parse(r.responseText));
                } else {
                    reject();
                }
            };
            r.onerror = reject;
            r.send();
        });
    }

    // Post a form
    static postForm(url, data) {
        return new Promise((resolve, reject) => {
            let urlEncodedData = "";
            let urlEncodedDataPairs = [];
            let name;

            // Turn the data object into an array of URL-encoded key/value pairs.
            for(name in data) {
                urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
            }

            // Combine the pairs into a single string and replace all %-encoded spaces to
            // the '+' character; matches the behaviour of browser form submissions.
            urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

            let r = new XMLHttpRequest();
            r.open("POST", url, true);
            r.setRequestHeader("Content-Type", "multipart/x-www-form-urlencoded");
            r.setRequestHeader('X-CSRF-Token', document.head.querySelector("[name=csrf-token]").content);
            r.onload = () => {
                if (r.status >= 200 && r.status < 400) {
                    resolve();
                } else {
                    reject();
                }
            };
            r.onerror = reject;
            r.send(urlEncodedData);
        });
    }
}

// OnLoad attach fades
DeBallenbak.onLoad(() => {
    let handleFade = () => {
        let els = document.getElementsByClassName("fadeIn");
        for (let i = 0; i < els.length; i++) {
            let el = els[i];
            if (!el.style.opacity || el.style.opacity === "0") {
                let objectTop = el.getBoundingClientRect().top + document.documentElement.scrollTop;
                let bottomWindow = document.documentElement.scrollTop + window.outerHeight;

                if (bottomWindow > objectTop) {
                    DeBallenbak.fadeIn(el);
                }
            }
        }
    };
    window.addEventListener("scroll", handleFade.bind(this));
    window.addEventListener("resize", handleFade.bind(this));
    handleFade();
});

$(document).ready(function() {
    setTimeout(
        function() 
        {
//            if ($(".sk-facebook-photo-albums-all-posts")[0]){
//                $(".sk-facebook-photo-albums-all-posts").css("background-color", "red");
//            } else {
//                console.log( "niet aanwezig!" );
//            }
            if ($(".tutorial_link")[0]){
                $(".tutorial_link").css("display", "none");
            } else {
                console.log( "niet aanwezig!" );
            }
            if ($('#mobile-only-visible').is(':visible'))
            {
                $(".sk-ww-facebook-photo-albums-item:eq(2)").css("display", "none");
                $(".sk-ww-facebook-photo-albums-item:eq(3)").css("display", "none");
                $(".sk-ww-facebook-photo-albums-item:eq(4)").css("display", "none");
                $(".sk-ww-facebook-photo-albums-item:eq(5)").css("display", "none");
            }
//            console.log( "ready!" );
        }, 1000);

});