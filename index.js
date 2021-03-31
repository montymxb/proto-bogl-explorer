
function test1() {

  const Parser = require('tree-sitter');
  const Bogl = require('tree-sitter-bogl');

  const parser = new Parser();
  parser.setLanguage(Bogl);

  let sourceCode = 'game Ex\n\nv : Int\nv = 2 * 2 + 4';
  const brokenSC = sourceCode.split("\n");
  const tree = parser.parse(sourceCode);

  console.log(tree.rootNode.toString());

  // 1. Using the parse tree, grab & tag all the relevant parts to BoGL
  // 2. Means annotating each 'label' with a portion of code it applies to
  // 3. repeat this nesting, and filter out the portion that is contained in sub-labels
  // 4. combine and we're done

  // rows can be obtained by splitting on line breaks, easy
  const g = tree.rootNode;
  console.log(g)
  console.log("    ")

  // tag everything by changing
  const callExpression = tree.rootNode.child(0).child(0).child(1);
  console.log(callExpression);

}

/**/
function testWASM() {
  const Parser = require('web-tree-sitter');

  (async () => {
    await Parser.init();
    const parser = new Parser();
    const Bogl = await Parser.Language.load('tree-sitter-bogl.wasm');
    parser.setLanguage(Bogl);
    const tree = parser.parse('game Ex\n\nv : Int\nv = 2 * 2 + 4');
    console.log(tree.rootNode.toString());
  })();
}
/**/

testWASM();
