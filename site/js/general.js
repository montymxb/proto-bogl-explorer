"use strict";

function unescapeHTML(s) {
  return s.replaceAll(/&lt;/g, "<").replaceAll(/&gt;/g, ">").replaceAll(/&amp;/g, "&");
}

function code(c) {

  // generate highlighed bogl code
  c = TreeSitterBogl.highlight(c);

  // now adjust for formatting
  c = c.replaceAll(/\n/gi, '<br/>');
  c = c.replaceAll(/\t/gi, '&nbsp;&nbsp;&nbsp;&nbsp;');
  c = c.replaceAll(/\s\s/gi, '&nbsp;&nbsp;');
  return c;
}
