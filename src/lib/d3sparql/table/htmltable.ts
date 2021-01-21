/*
    Rendering sparql-results+json object containing multiple rows into a HTML table
  
    Options:
      config = {
        "selector": "#result"
      }
  
    Synopsis:
      d3sparql.query(endpoint, sparql, render)
  
      function render(json) {
        var config = { ... }
        d3sparql.htmltable(json, config)
      }
  
    CSS:
      <style>
      table {
        margin: 10px;
      }
      th {
        background: #eeeeee;
      }
      th:first-letter {
         text-transform: capitalize;
      }
      </style>
  */
d3sparql.htmltable = function (json, config) {
  config = config || {}

  var head = json.head.vars
  var data = json.results.bindings

  var opts = {
    selector: config.selector || null
  }

  var table = d3sparql.select(opts.selector, 'htmltable').append('table').attr('class', 'table table-bordered')
  var thead = table.append('thead')
  var tbody = table.append('tbody')
  thead
    .append('tr')
    .selectAll('th')
    .data(head)
    .enter()
    .append('th')
    .text(function (col) {
      return col
    })
  var rows = tbody.selectAll('tr').data(data).enter().append('tr')
  var cells = rows
    .selectAll('td')
    .data(function (row) {
      return head.map(function (col) {
        return row[col] ? row[col].value : ''
      })
    })
    .enter()
    .append('td')
    .text(function (val) {
      return val
    })

  // default CSS
  table.style({
    margin: '10px'
  })
  table.selectAll('th').style({
    background: '#eeeeee',
    'text-transform': 'capitalize'
  })
}
