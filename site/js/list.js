"use strict";

window.onload = function() {

  // asynchronously setup the highlighting
  TreeSitterBogl.init().then(() => {
    let codeDivs = document.getElementsByClassName("code");

    for(let x = 0; x < codeDivs.length; x++) {
      let cd = codeDivs[x];
      cd.innerHTML = code(unescapeHTML(cd.innerHTML));
    }

    document.getElementById("results").style.display = "block";

  }).catch((e) => {
    console.error("Failed to setup highlighting w/ error");
    console.error(e);

  });
}
