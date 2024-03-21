// create an array with nodes
var nodes = new vis.DataSet([
    {id: 1, label: 'Arsen'},
    {id: 2, label: 'Danial'},
    {id: 3, label: 'Nurlubek'},
    {id: 4, label: 'Adil'},
    {id: 5, label: 'iDOS'},
    {id: 6, label: 'BSNF'},
]);

// create an array with edges
var edges = new vis.DataSet([
    {from: 1, to: 4},
    {from: 1, to: 2},
    {from: 2, to: 4},
    {from: 2, to: 5}
]);

// create a network
var container = document.getElementById('mynetwork');

// provide the data in the vis format
var data = {
    nodes: nodes,
    edges: edges
};
var options = {};

// initialize your network!
var network = new vis.Network(container, data, options);