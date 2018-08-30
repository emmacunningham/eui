const datavizGithubIssues = [['Team Member', 'Data Table', 'Bug', 14],
  ['Team Member', 'Data Table', 'Other', 22],
  ['Team Member', 'Heatmap', 'Bug', 12],
  ['Team Member', 'Heatmap', 'Other', 6],
  ['Team Member', 'Markdown', 'Bug', 6],
  ['Team Member', 'Markdown', 'Other', 11],
  ['Team Member', 'MetricVis', 'Bug', 16],
  ['Team Member', 'MetricVis', 'Other', 8],
  ['Team Member', 'Pie Chart', 'Bug', 7],
  ['Team Member', 'Pie Chart', 'Other', 4],
  ['Team Member', 'Tagcloud', 'Bug', 19],
  ['Team Member', 'Tagcloud', 'Other', 13],
  ['Team Member', 'TSVB', 'Bug', 86],
  ['Team Member', 'TSVB', 'Other', 123],
  ['Team Member', 'Timelion', 'Bug', 58],
  ['Team Member', 'Timelion', 'Other', 93],
  ['Team Member', 'Vega vis', 'Bug', 11],
  ['Team Member', 'Vega vis', 'Other', 38],
  ['Team Member', 'Point Series', 'Bug', 1],
  ['Team Member', 'Point Series', 'Other', 1],
  ['Team Member', 'Inspector', 'Bug', 15],
  ['Team Member', 'Inspector', 'Other', 11],
  ['Community', 'Data Table', 'Bug', 6],
  ['Community', 'Data Table', 'Other', 24],
  ['Community', 'Heatmap', 'Bug', 11],
  ['Community', 'Heatmap', 'Other', 5],
  ['Community', 'Markdown', 'Bug', 0],
  ['Community', 'Markdown', 'Other', 1],
  ['Community', 'MetricVis', 'Bug', 6],
  ['Community', 'MetricVis', 'Other', 10],
  ['Community', 'Pie Chart', 'Bug', 3],
  ['Community', 'Pie Chart', 'Other', 5],
  ['Community', 'Tagcloud', 'Bug', 2],
  ['Community', 'Tagcloud', 'Other', 1],
  ['Community', 'TSVB', 'Bug', 28],
  ['Community', 'TSVB', 'Other', 51],
  ['Community', 'Timelion', 'Bug', 29],
  ['Community', 'Timelion', 'Other', 43],
  ['Community', 'Vega vis', 'Bug', 2],
  ['Community', 'Vega vis', 'Other', 9],
  ['Community', 'Point Series', 'Bug', 2],
  ['Community', 'Point Series', 'Other', 3],
  ['Community', 'Inspector', 'Bug', 5],
  ['Community', 'Inspector', 'Other', 8]];

export const dataset = datavizGithubIssues.map(d => {
  return {
    authorAssociation: d[0],
    vizType: d[1],
    issueType: d[2],
    count: d[3]
  };
});