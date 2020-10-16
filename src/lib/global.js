// alert
(function() {
    var alert = document.createElement("div");
    alert.id = "_alert";
    alert.classList.add("cover");
    alert.classList.add("center");
    Object.assign(alert.style, {
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 9999,
        backgroundColor: "rgba(20,20,20,0.7)",
        display: "none"
    });
    var win = document.createElement("div");
    win.classList.add("center");
    win.classList.add("animated");
    win.classList.add("zoomIn");
    var close = document.createElement("button");
    close.innerHTML = "ACEPTAR";
    Object.assign(close.style, {
        width: "130px",
        margin: "auto"
    });
    close.onclick = () => {
        alert.style.display = "none";
    };
    Object.assign(win.style, {
        width: "300px",
        height: "300px",
        borderRadius: "5px",
        backgroundColor: "white",
        position: "relative",
        display: "grid",
        gridTemplateRows: "auto 80px",
        gridTemplateColumns: "100%"
    });
    var content = document.createElement("div");
    // content.classList.add("center");
    Object.assign(content.style, {
        overflowY: "auto",
        padding: "20px",
        height: "100%"
    });
    var p = document.createElement("p");
    Object.assign(p.style, {
        fontSize: "1.2em",
        margin: "0",
        wordBreak: "break-all"
    });
    content.appendChild(p);
    win.appendChild(content);
    win.appendChild(close);
    alert.appendChild(win);
    document.querySelector("body").appendChild(alert);
})();

// loading
(function() {
    var loading = document.createElement("div");
    loading.id = "__loading";
    loading.classList.add("cover");
    loading.classList.add("center");
    Object.assign(loading.style, {
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: "99999",
        backgroundColor: "rgba(20,20,20,0.7)",
        display: "none",
        transition: "all ease 350ms"
    });
    var window = document.createElement("div");
    window.classList.add("__window_loading");
    Object.assign(window.style, {
        backgroundColor: "white",
        overflow: "hidden",
        borderRadius: "5px",
        width: "300px",
        height: "100px",
        display: "grid",
        gridTemplateColumns: "60px auto",
        alignItems: "center",
        padding: "18px",
        boxShadow: "0 5px 18px 0px rgba(0, 0, 0, 0.14)"
    });
    window.innerHTML = `
        <style>
            @keyframes __spin_loader {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
        <div id="__loader" style="border: 6px solid #e4e4e4;
        border-top: 6px solid #FF9800;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: __spin_loader 2s linear infinite;"></div>

        <i class="fa fa-check cover center" style="
        display:none;font-size: 2em;color: #4CAF50;"></i>
        
        <p style="margin: 0;
        width: 100%;
        text-align: center;
        letter-spacing: 0.05em;
        font-size: 1.1em;
        color: #6b6b6b;
        text-transform: uppercase;"></p>
    `;
    loading.appendChild(window);
    document.querySelector("body").appendChild(loading);
})();

GLOBAL = {
    loadingInAnimation: false,
    alert(msg = "") {
        const el = document.querySelector("#_alert");
        if (typeof msg === "object") {
            msg = JSON.stringify(msg);
        }
        el.querySelector("p").innerHTML = msg;
        el.style.display = "flex";
    },
    async loading(value = true, msg = "cargando") {
        const ng = document.querySelector("app-root");
        const el = document.querySelector("#__loading");
        const win = el.querySelector(".__window_loading");
        const wait = time =>
            new Promise(done => setTimeout(() => done(), time));

        if (this.loadingInAnimation) {
            await wait(500);
        }

        el.querySelector("p")
            .html(msg)
            .in("slideInRight", 300);
        if (value) {
            this.loadingInAnimation = true;
            win.in("fadeInDown", "grid");
            el.style.display = "flex";
            el.querySelector("i").visible(false);
            el.querySelector("#__loader")
                .in("zoomIn")
                .then(() => {
                    this.loadingInAnimation = false;
                });
            ng.style.filter = "blur(5px)";
        } else {
            this.loadingInAnimation = true;
            el.querySelector("#__loader").visible(false);
            el.querySelector("i").in("zoomIn", "flex");
            this.stop = false;
            this.timeLoading = setTimeout(() => {
                win.out("fadeOutUp", 200).then(() => {
                    ng.style.filter = "blur(0)";
                    el.out("fadeOut", 200).then(() => {
                        el.visible(false);
                        this.loadingInAnimation = false;
                    });
                });
            }, 500);
        }
    }
};
