/*
    Rendering sparql-results+json object into a dendrogram
  
    References:
      http://bl.ocks.org/4063570  Cluster Dendrogram
  
    Options:
      config = {
        "width":    900,       // canvas width (optional)
        "height":   4500,      // canvas height (optional)
        "margin":   300,       // width margin for labels (optional)
        "radius":   5,         // radius of node circles (optional)
        "selector": "#result"
        // options for d3sparql.tree() can be added here ...
      }
  
    Synopsis:
      d3sparql.query(endpoint, sparql, render)
  
      function render(json) {
        var config = { ... }
        d3sparql.dendrogram(json, config)
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
        stroke: steelblue;
        stroke-width: 1.5px;
        opacity: 1;
      }
      .node text {
        font-size: 10px;
        font-family: sans-serif;
      }
      </style>
  */
d3sparql.dendrogram = function (json, config) {
  config = config || {}

  var tree = json.head && json.results ? d3sparql.tree(json, config) : json

  var opts = {
    width: config.width || 800,
    height: config.height || 2000,
    margin: config.margin || 350,
    radius: config.radius || 5,
    selector: config.selector || null
  }

  var cluster = d3.layout.cluster().size([opts.height, opts.width - opts.margin])
  var diagonal = d3.svg.diagonal().projection(function (d) {
    return [d.y, d.x]
  })
  var svg = d3sparql
    .select(opts.selector, 'dendrogram')
    .append('svg')
    .attr('width', opts.width)
    .attr('height', opts.height)
    .append('g')
    .attr('transform', 'translate(40,0)')
  var nodes = cluster.nodes(tree)
  var links = cluster.links(nodes)
  var link = svg.selectAll('.link').data(links).enter().append('path').attr('class', 'link').attr('d', diagonal)
  var node = svg
    .selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', function (d) {
      return 'translate(' + d.y + ',' + d.x + ')'
    })
  var circle = node.append('circle').attr('r', opts.radius)
  var text = node
    .append('text')
    .attr('dx', function (d) {
      return d.parent && d.children ? -8 : 8
    })
    .attr('dy', 5)
    .style('text-anchor', function (d) {
      return d.parent && d.children ? 'end' : 'start'
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
