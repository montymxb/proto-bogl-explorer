window.onload = function() {

  function code(c) {
    c = c.replaceAll(/\n/gi, '<br/>');
    c = c.replaceAll(/\t/gi, '&nbsp;&nbsp;&nbsp;&nbsp;');
    c = c.replaceAll(/\s\s/gi, '&nbsp;&nbsp;');
    return c;
  }

  let codeDivs = document.getElementsByClassName("code");

  for(let x = 0; x < codeDivs.length; x++) {
    let cd = codeDivs[x];
    cd.innerHTML = code(cd.innerHTML);
  }

}
