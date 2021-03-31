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

  // highlight all matches to a pattern with an attribute
  function highlight(code,attr,before="",after="") {
    return before+hl(code,attr)+after;
  }

  function hl(code,attr) {
    return "<span class='"+attr+"'>" + code + "</span>";
  }

  function code(c) {

    // perform some basic highlighting
    // problem is I would have to write up a lexer AND a parser...but I don't want to do that...
    // back off this crap and try tree-sitter instead
    // >>>> https://github.com/tree-sitter/tree-sitter/tree/master/lib/binding_web
    // >>>> 1st, set things up for webassembly, THEN
    /*
    c = c.replaceAll(/\/([^\=])/gi,hl("/","Division")+"$1");
    c = c.replaceAll(/\/=/gi,highlight("/=","Relational_Inequality"));
    c = c.replaceAll(/==/gi,highlight("==","Relational_Equality"));
    c = c.replaceAll(/>=/gi,highlight("&gt;=","Greater_Than_or_Equal_To"));
    c = c.replaceAll(/<=/gi,highlight("&lt;=","Less_Than_or_Equal_To"));
    c = c.replaceAll(/>([^\=])/gi,hl(">","Greater_Than")+"$1");
    c = c.replaceAll(/<([^\=])/gi,hl("<","Less_Than")+"$1");
    c = c.replaceAll(/(=.*)([A-Z][a-zA-Z0-9_]*)/gi,highlight("$2","Symbol_Expressions", "$1"));
    c = c.replaceAll(/(=.*)(let)(\s+[a-z][a-zA-Z0-9_]*\s+)(=)(.*)(in)/gi,"$1"+hl("$2","Let_Expressions")+"$3"+hl("$4","Let_Expressions")+"$5"+hl("$6","Let_Expressions"));
    c = c.replaceAll(/-/gi,highlight("-","Subtraction"));
    c = c.replaceAll(/\\/gi,highlight("*","Multiplication"));
    c = c.replaceAll(/\+/gi,highlight("+","Addition"));
    */

    // now adjust for formatting
    c = c.replaceAll(/\n/gi, '<br/>');
    c = c.replaceAll(/\t/gi, '&nbsp;&nbsp;&nbsp;&nbsp;');
    c = c.replaceAll(/\s\s/gi, '&nbsp;&nbsp;');
    return c;
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

  function handleUpdate(e) {
    if (e.key == 'Tab') {
      e.preventDefault();
      var start = this.selectionStart;
      var end = this.selectionEnd;

      // set textarea value to: text before caret + tab + text after caret
      this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);

      // put caret at right position again
      this.selectionStart = this.selectionEnd = start + 1;
    }
  }

  function onChange(e) {
    localStorage.setItem(this.id,this.value);
  }


  window.onload = function() {

    let ca1 = document.getElementById('codearea1');
    let ca2 = document.getElementById('codearea2');

    ca1.addEventListener('keydown', handleUpdate);
    ca2.addEventListener('keydown', handleUpdate);

    ca1.addEventListener('change', onChange);
    ca2.addEventListener('change', onChange);

    let v1 = localStorage.getItem('codearea1');
    let v2 = localStorage.getItem('codearea2');

    if(v1) {
      ca1.value = v1;
    }

    if(v2) {
      ca2.value = v2;
    }

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
        knownProg: document.getElementById("codearea1").value,
        goalProg: document.getElementById("codearea2").value
      })
    })
  }

})(window,document)
