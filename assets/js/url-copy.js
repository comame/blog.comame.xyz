let coping = false;
document.querySelectorAll("#share a")[2].addEventListener("click", function() {
    if (coping) return;
    coping = true;
    const tmp = document.createElement("div");
    tmp.appendChild(document.createElement("pre")).textContent = "https://" + location.host + location.pathname;
    tmp.style.position = "fixed";
    tmp.style.left = "-100%";
    document.body.appendChild(tmp);
    document.getSelection().selectAllChildren(tmp);
    const result = document.createElement("div");
    result.style = "position: fixed; bottom: 0; color: white; padding: 0.5em 1em; width: 100%;";
    if (document.execCommand("copy")) {
        result.innerText = "URL をコピーしました";
        result.setAttribute("style", "position: fixed; bottom: 0; color: white; padding: 0.5em 1em; width: 100%; background: rgba(32, 33, 35, 0.8);");
        document.body.appendChild(result);
        setTimeout(function() {
            document.body.removeChild(result);
            coping = false;
        }, 3000);
    } else {
        result.innerText = "URL をコピーできませんでした";
        result.setAttribute("style", "position: fixed; bottom: 0; color: white; padding: 0.5em 1em; width: 100%; background: rgba(214, 11, 11, 0.6);");
        document.body.appendChild(result);
        setTimeout(function() {
            document.body.removeChild(result);
            coping = false;
        }, 3000);
    }
    document.body.removeChild(tmp);
});
