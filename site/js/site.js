"use strict";

/*
setTimeout(function() {
  // EXTREMELY HACKY EXPERIMENT WITH POSITIONS, NOT QUITE RIGHT, but kept for notes
  console.log("Selected...");
  //console.log(document.getSelection());
  let selection = window.getSelection();
  const oldRange = selection.getRangeAt(0);
  console.log(oldRange);

  // get index in parent that this 'came from'
  //const div = document.getElementById("codearea1");
  let xx = oldRange.getBoundingClientRect().x;
  let yy = oldRange.getBoundingClientRect().y;
  //console.dir(oldRange.comparePoint(0,0));
  //console.log(oldRange.startContainer.parentElement.getBoundingClientRect());
  //console.log(div.childNodes);

  const range = document.createRange();
  console.log(range);
  range.setStart(document.elementFromPoint(xx,yy).childNodes[0], 0);
  range.collapse(true);

  setTimeout(function() {
    //let e = document.elementFromPoint(xx,yy);
    //console.dir(e);
    selection.removeAllRanges();
    selection.addRange(range)
    //e.focus();
    //e.click();
  },1000);

  //console.dir(range);

  //e.target.innerHTML = code(e.target.innerText);

  //selection.removeAllRanges();
  //selection.addRange(range);
  //div.focus();
  ////this.innerHTML = code(this.value);
}, 2000);
*/

(function(window,document) {

  let d3Grapher = null;

  function renderGraph(dotContent) {
    var t = d3.transition()
    .duration(333)
    .ease(d3.easeLinear);
    d3Grapher.transition(t).renderDot(dotContent);
  }

  function updateError(msg) {
    document.getElementById("loadspace").innerHTML = "<div id='error'>Error: "+msg+"</div>";
  }

  // adds a fringe element
  function populateFringe(s) {

    let r = "<p id='count'>found " + Object.keys(s).length + " next programs</p>";
    if(Object.keys(s).length == 1) {
      r = "<p id='count'>found 1 next program</p>";
    }

    let key = "";

    for(key in s) {
      if(s[key]["attrs"].length > 0) {
        let c = code(s[key]["code"]);
        let a = "This program introduces the language features: " + s[key]["attrs"].map((s) => "<span class='attr'>" + s.replaceAll(/_/gi," ") + "</span>").join(", ");
        if(s[key]["attrs"].length == 1) {
          a = "This program introduces the language feature of " + s[key]["attrs"].map((s) => "<span class='attr'>" + s.replaceAll(/_/gi," ") + "</span>")[0];
        }
        let combinedAttrs = s[key]["attrs"].join(" ");
        r += "<div class='item'><h3>" + key.replaceAll(/_/gi, " ") + "</h3><h4 class='attrs'>" + a + "</h4><div class='code "+combinedAttrs+"'>" + c + "</div></div>";
      } else {
        let c = code(s[key]["code"]);
        r += "<h3>" + key.replaceAll(/_/gi, " ") + "</h3><div class='code'>" + c + "</div>";
      }
    }

    /*
    for(key in s) {
      if(s[key]["attrs"].length > 0) {
        let c = code(s[key]["code"]);
        let a = "This program introduces the language features: " + s[key]["attrs"].map((s) => "<span class='attr'>" + s.replaceAll(/_/gi," ") + "</span>").join(", ");
        if(s[key]["attrs"].length == 1) {
          a = "This program introduces the language feature of " + s[key]["attrs"].map((s) => "<span class='attr'>" + s.replaceAll(/_/gi," ") + "</span>")[0];
        }
        r += "<div class='item'><h3>" + key.replaceAll(/_/gi, " ") + "</h3><h4 class='attrs'>" + a + "</h4><div class='code'>" + c + "</div></div>";
      }
    }
    for(key in s) {
      if(s[key]["attrs"].length == 0) {
        let c = code(s[key]["code"]);
        r += "<h3>" + key.replaceAll(/_/gi, " ") + "</h3><div class='code'>" + c + "</div>";
      }
    }
    */

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
      document.getElementById("codearea1").value = "";
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

  function handleUpdate(e) {
    //e.preventDefault();
    //console.log(e);

    if (e.key == 'Tab') {
      e.preventDefault();
      let start = this.selectionStart;
      let end = this.selectionEnd;

      // set textarea value to: text before caret + tab + text after caret
      this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);

      // put caret at right position again
      this.selectionStart = this.selectionEnd = start + 1;
    }

    // TODO old div updating
    // reapply highlighting
    //console.log("BEFORE");
    //console.dir(e);
    //e.target.innerHTML = code(e.target.innerText);
    //console.log("AFTER");
    //console.dir(e);
    /*
    setTimeout(() => {
      let cav = document.getElementById(this.id + '-v');
      cav.innerHTML = code(this.value);
    }, 5);
    */

  }

  function onChange(id,val) {
    localStorage.setItem(id,val);
  }

  window.onload = function() {
    let ca1 = document.getElementById('codearea1');
    let ca2 = document.getElementById('codearea2');

    let v1 = localStorage.getItem('codearea1');
    let v2 = localStorage.getItem('codearea2');

    if(v1) {
      ca1.value = v1;
    }

    if(v2) {
      ca2.value = v2;
    }

    const cmSettings = {
      lineWrapping: true,
      lineNumbers: true,
      mode: "bogl",
      tabSize: 3
    }

    // setup codemirror editors
    let editor1 = CodeMirror.fromTextArea(ca1, cmSettings);

    let editor2 = CodeMirror.fromTextArea(ca2, cmSettings);

    const oc = (i,o) => {
      onChange(i.getTextArea().id, i.getValue());
    };

    editor1.on('change', oc);
    editor2.on('change', oc);

    // asynchronously setup the highlighting
    TreeSitterBogl.init().then(() => {
      console.log("TreeSitterBogl ready 👍");

    }).catch((e) => {
      console.error("Failed to setup highlighting w/ error");
      console.error(e);

    });

    d3Grapher = d3.select("#graph").graphviz({
      width: "100vw",
      //height: "500",
      fit: true,
      zoom: false, // zoom disabled for now, it's often buggy
      zoomScaleExtent: [0.7,1],
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
        knownProg: editor1.getValue(),
        goalProg: editor2.getValue()
      })
    });
  }

})(window,document)
