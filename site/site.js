"use strict";
(function(window,document) {

  let d3Grapher = null;

  function renderGraph(dotContent) {
    var t = d3.transition()
    .duration(333)
    .ease(d3.easeLinear);
    d3Grapher.transition(t).renderDot(dotContent);
  }

  function updateError(msg) {
    document.getElementById("loadspace").innerHTML = "<div id='error'>Error: "+msg+"</div>"
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
        let a = "* This program introduces the concepts " + s[key]["attrs"].map((s) => s.replaceAll(/_/gi," ")).join(", ");
        if(s[key]["attrs"].length == 1) {
          a = "* This program introduces the concept of " + s[key]["attrs"].map((s) => s.replaceAll(/_/gi," "))[0];
        }
        r += "<h3>" + key.replaceAll(/_/gi, " ") + "</h3><span class='attr'>" + a + "</span><div class='code'>" + c + "</div>";
      }
    }
    for(key in s) {
      if(s[key]["attrs"].length == 0) {
        let c = code(s[key]["code"]);
        r += "<h3>" + key.replaceAll(/_/gi, " ") + "</h3><span class='attr'></span><div class='code'>" + c + "</div>";
      }
    }
    document.getElementById("results").innerHTML = r;
  }

  // handle sending & getting a request from the backend
  // Runs bogl code on the server, returns the result as JSON
  function mkPOST(url,content) {
    document.getElementById("loadspace").innerHTML = "<div id='load1' class='loading'></div>";
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
      document.getElementById("loadspace").innerHTML = "";
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

  function setKnown(p) {
    if(p) {
      document.getElementById("codearea1").value = p;
    } else {
      document.getElementById("codearea1").value = ""
    }
  }

  function setGoal(p) {
    if(p) {
      document.getElementById("codearea2").value = p;
    } else {
      document.getElementById("codearea2").value = "";
    }
  }

  let windowGet = {};
  if(document.location.toString().indexOf('?') !== -1) {
      let query = document.location
                     .toString()
                     // get the query string
                     .replace(/^.*?\?/, '')
                     // and remove any existing hash string (thanks, @vrijdenker)
                     .replace(/#.*$/, '')
                     .split('&');

      for(var i=0, l=query.length; i<l; i++) {
         let aux = decodeURIComponent(query[i]).split('=');
         windowGet[aux[0]] = aux[1].replaceAll(/\+/gi," ");
      }
  }


  window.onload = function() {

    d3Grapher = d3.select("#graph").graphviz({
      width: "100vw",
      height: "500",
      fit: true,
      zoom: false,
      zoomScaleExtent: [0.7,3],
      zoomTranslateExtent: [[-1000, -1000], [1000, 1000]]
    }).fade(true)
      .growEnteringEdges(true);

    let e = document.getElementById("search")
    e.addEventListener("click",() => {
      let endpoint = "/api";
      if(window.location.protocol === "file:") {
        // switch to local endpoint for testing
        endpoint = "http://localhost:8181/api";
      }

      mkPOST(endpoint,{
        knownProg: document.getElementById("codearea1").value,
        goalProg: document.getElementById("codearea2").value
      })
    })
  }

})(window,document)
