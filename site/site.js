"use strict";
(function(window,document) {

  // handle sending & getting a request from the backend
  // Runs bogl code on the server, returns the result as JSON
  function mkPOST(url,content) {
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
      /*
      callback({
        response: resp,
        status: respStatus
      });
      */
      console.dir(resp)

    }).catch((error) => {
      alert("Error occurred...(TODO show this on the UI via an interaction)");
      /*
      if((error instanceof SyntaxError || (error.name && error.name === "SyntaxError")) && respStatus === 504) {
        // gateway timeout
        updateResults(elm, " 🤖 BoGL Says: Unable to finish running your program, or not currently online. Double check your code, or check back later! ");

      } else if((error instanceof SyntaxError || (error.name && error.name === "SyntaxError"))) {
        // bad parse error
        updateResults(elm, " 🤖 BoGL Says: Your program was unable to be understood. Please double check it and try again! ");

      } else if((error instanceof TypeError || (error.name && error.name === "TypeError")) && respStatus === 0) {
        // likely JS disabled
        updateResults(elm, " 🤖 BoGL Says: Unable to execute your program. Make sure that Javascript is enabled and try again! ");

      } else if((error instanceof TypeError || (error.name && error.name === "TypeError"))) {
        // something else?
        console.error(error);
        updateResults(elm, " 🤖 BoGL Says: Unable to execute your program, please double check your code and try again. ");

      } else {
        // general error
        updateResults(elm, " 🤖 BoGL Says: An error occurred: " + error + " ");

      }
      */
    });
  }


  window.onload = function() {
    let e = document.getElementById("search")
    e.addEventListener("click",() => {
      mkPOST("http://localhost:8181/api",{prog: "game Test"})
    })
  }

})(window,document)
