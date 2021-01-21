/*
    Rendering sparql-results+json object into a round tree
  
    References:
      http://bl.ocks.org/4063550  Reingold-Tilford Tree
  
    Options:
      config = {
        "diameter": 800,       // canvas diameter (optional)
        "angle":    360,       // arc angle (optional; less than 360 for wedge)
        "depth":    200,       // arc depth (optional; less than diameter/2 - label length to fit)
        "radius":   5,         // node radius (optional)
        "selector": "#result"
        // options for d3sparql.tree() can be added here ...
      }
  
    Synopsis:
      d3sparql.query(endpoint, sparql, render)
  
      function render(json) {
        var config = { ... }
        d3sparql.roundtree(json, config)
      }
  
    CSS/SVG:
      <style>
      .link {
        fill: none;
        stroke: #cccccc;
        stroke-width: 1.5px;
      }
      .node circle {
        fill: #ffffff;
        stroke: darkgreen;
        stroke-width: 1.5px;
        opacity: 1;
      }
      .node text {
        font-size: 10px;
        font-family: sans-serif;
      }
      </style>
  */
d3sparql.roundtree = function (json, config) {
  config = config || {}

  var tree = json.head && json.results ? d3sparql.tree(json, config) : json

  var opts = {
    diameter: config.diameter || 800,
    angle: config.angle || 360,
    depth: config.depth || 200,
    radius: config.radius || 5,
    selector: config.selector || null
  }

  var tree_layout = d3.layout
    .tree()
    .size([opts.angle, opts.depth])
    .separation(function (a, b) {
      return (a.parent === b.parent ? 1 : 2) / a.depth
    })
  var nodes = tree_layout.nodes(tree)
  var links = tree_layout.links(nodes)
  var diagonal = d3.svg.diagonal.radial().projection(function (d) {
    return [d.y, (d.x / 180) * Math.PI]
  })
  var svg = d3sparql
    .select(opts.selector, 'roundtree')
    .append('svg')
    .attr('width', opts.diameter)
    .attr('height', opts.diameter)
    .append('g')
    .attr('transform', 'translate(' + opts.diameter / 2 + ',' + opts.diameter / 2 + ')')
  var link = svg.selectAll('.link').data(links).enter().append('path').attr('class', 'link').attr('d', diagonal)
  var node = svg
    .selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', function (d) {
      return 'rotate(' + (d.x - 90) + ') translate(' + d.y + ')'
    })
  var circle = node.append('circle').attr('r', opts.radius)
  var text = node
    .append('text')
    .attr('dy', '.35em')
    .attr('text-anchor', function (d) {
      return d.x < 180 ? 'start' : 'end'
    })
    .attr('transform', function (d) {
      return d.x < 180 ? 'translate(8)' : 'rotate(180) translate(-8)'
    })
    .text(function (d) {
      return d.name
    })

  // default CSS/SVG
  link.attr({
    fill: 'none',
    stroke: '#cccccc',
    'stroke-width': '1.5px'
  })
  circle.attr({
    fill: '#ffffff',
    stroke: 'steelblue',
    'stroke-width': '1.5px',
    opacity: 1
  })
  text.attr({
    'font-size': '10px',
    'font-family': 'sans-serif'
  })
}
