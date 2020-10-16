var TOAST = new (function() {
    var toast,
        global_time = null;
    var init = function(data = {}) {
        // Create TOAST
        toast = document.createElement("div");
        toast.id = "__TOAST";
        global_time = data.time || 4000;

        Object.assign(toast.style, {
            position: "absolute",
            top: "0",
            right: "0",
            width: "300px",
            height: "100%",
            zIndex: "99999",
            pointerEvents: "none",
            borderRadius: "5px",
            padding: "10px",
            paddingLeft: "30px",
            paddingBottom: "17px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end"
        });
        var body = document.querySelector("body");
        body.insertBefore(toast, body.firstChild);
        // css
        var style = document.createElement("style");
        style.innerHTML = `
            .toastIn{
                opacity:1 !important;
                transform:scale(1) !important;
            }
            .toastOut{
                transform:scale(0.6) !important;
                opacity:0 !important;
            }
            .TOAST {
                width: 100%;
                padding: 10px 50px 10px 10px;
                min-height: 50px;
                color: white;
                border-radius: 5px;
                background-image: linear-gradient(48deg, #5452b4, #7977d6);
                box-shadow: 0px 7px 20px -4px rgba(35, 34, 45, 0.43);
                position: relative;
                margin-bottom: 13px;
                display: flex;
                align-items: center;
                transition: all 250ms ease 0s;
                opacity: 0;
                transform: scale(0.7);
                font-family: sans-serif;
            }
            .TOAST .close_toast {
                position:absolute;
                right:0;
                top:0;
                width:50px;
                height:100%;
                padding-top:10px;
                padding-bottom:10px;
                pointer-events: all;
                cursor: pointer;
            }
            .TOAST .close_toast div {
                display:flex;
                justify-content:center;
                align-items:center;
                width:100%;
                height:100%;
                border-left-style: solid;
                border-width: 1px;
                font-family: monospace;
                font-size: 2.3em;
                border-color: white;
                color: white;
            }
        `;
        document.querySelector("head").appendChild(style);
    };
    var close = function(el) {
        el.classList.add("toastOut");
        setTimeout(function() {
            el.remove();
        }, 250);
    };
    var add = function(text, time) {
        if (typeof text === "object") {
            text = JSON.stringify(text);
        }
        if (!time) time = global_time;
        var $toast = document.createElement("div");
        $toast.classList.add("TOAST");
        $toast.innerHTML = `
            <p style="margin:0;">${text}</p>
            <div class="close_toast" onclick="TOAST.close(this.parentNode);">
                <div>×</div>
            </div>
        `;
        toast.appendChild($toast);
        setTimeout(function() {
            close($toast);
        }, time);
        return $toast;
    };
    this.add = function(a, t) {
        var t = add(a, t);
        setTimeout(function() {
            t.classList.add("toastIn");
        }, 10);
    };
    this.close = close;
    init();
})();
