"use strict";
(function(window,document) {

  function renderGraph(dotContent) {
    /*
    d3.select("#graph").graphviz({
      width: "100vw",
      height: "500",
      fit: true,
      zoomScaleExtent: [0.7,3],
      zoomTranslateExtent: [[-1000, -1000], [1000, 1000]]
    })
        .fade(true)
        .growEnteringEdges(true)
        .renderDot(dotContent);
        */
  }

  function updateError(msg) {
    document.getElementById("graph").innerHTML = "<div id='error'>Error: "+msg+"</div>"
  }

  function code(c) {
    c = c.replaceAll(/\n/gi, '<br/>');
    c = c.replaceAll(/\t/gi, '&nbsp;&nbsp;&nbsp;&nbsp;');
    return c;
  }

  // adds a fringe element
  function populateFringe(s) {

    let r = "<p id='count'>" + Object.keys(s).length + " results</p>";
    let key = "";
    console.dir(s)
    for(key in s) {
      if(s[key]["attrs"].length > 0) {
        let c = code(s[key]["code"]);
        let a = "* This program introduces " + s[key]["attrs"].join(", ");
        r += "<h3>" + key + "</h3><span class='attr'>" + a + "</span><div class='code'>" + c + "</div>";
      }
    }
    for(key in s) {
      if(s[key]["attrs"].length == 0) {
        let c = code(s[key]["code"]);
        r += "<h3>" + key + "</h3><span class='attr'></span><div class='code'>" + c + "</div>";
      }
    }
    document.getElementById("results").innerHTML = r;
  }

  // handle sending & getting a request from the backend
  // Runs bogl code on the server, returns the result as JSON
  function mkPOST(url,content) {
    document.getElementById("graph").innerHTML = "<div id='load1' class='loading'></div>";
    document.getElementById("results").innerHTML = "";
    fetch(url
      ,{
          method: "POST",
          headers: {
            'Accept'      : 'application/json',
            'Content-Type': 'application/json',
            'Allow'       : '*',
            'X-PGE-Key'   : '1',
          },
          body: JSON.stringify(content)
        }
    ).then(function(res) {
      //respStatus = res.status;
      return res.json();

    }).then(function(resp) {
      document.getElementById("graph").innerHTML = "";
      if(resp["content"]) {
        // good result
        renderGraph(resp["content"])
        delete resp["content"]
        // populate the fringe programs that come back
        populateFringe(resp)


      } else if(resp["error"]) {
        // parse error
        updateError(resp["error"])

      } else {
        // something else
        updateError("Unknown error")

      }

    }).catch((error) => {
      updateError(error);
      throw error;
    });
  }


  window.onload = function() {
    let e = document.getElementById("search")
    e.addEventListener("click",() => {
      mkPOST("http://localhost:8181/api",{prog: document.getElementById("codearea").value})
    })
  }

})(window,document)
