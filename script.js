// create an array with initial nodes
var nodes = new vis.DataSet([
    { id: 1, label: 'Arsen' },
    { id: 2, label: 'Danial' },
    { id: 3, label: 'Nurlubek' },
    { id: 4, label: 'Adil' },
    { id: 5, label: 'iDOS' },
    { id: 6, label: 'BSNF' }
]);

// create an array with initial edges
var edges = new vis.DataSet([
    { from: 1, to: 4 },
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 }
]);

// create a network
var container = document.getElementById('mynetwork');
var options = {
    edges: {
        arrows: {
            to: false
        }
    }
};
var data = {
    nodes: nodes,
    edges: edges
};
var network = new vis.Network(container, data, options);

// Add click event listener to the network
network.on('click', function(properties) {
    if (properties.nodes.length > 0) {
        let nodeId = properties.nodes[0];
        let node = nodes.get(nodeId);
        let newLabel = prompt(`Enter new label for node ${nodeId} (current label: ${node.label})`);
        if (newLabel !== null) {
            node.label = newLabel;
            nodes.update(node);
        }
    }
});

// Function to create a new node if it doesn't exist
function createNode(label) {
    let existingNode = nodes.get().find(node => node.label === label);
    if (!existingNode) {
        let newNodeId = nodes.length + 1;
        nodes.add({ id: newNodeId, label: label });
        return newNodeId;
    }
    return existingNode.id;
}

// Function to create a new edge
function createEdge(fromNode, toNode) {
    edges.add({ from: fromNode, to: toNode });
}

// Event listener for the "Enter" button
document.getElementById('button').addEventListener('click', function() {
    let input = document.getElementById('ar').value.trim();
    let lines = input.split('\n');
    lines.forEach(line => {
        let [from, to] = line.split(' ');
        if (from && to) {
            let fromNodeId = createNode(from);
            let toNodeId = createNode(to);
            createEdge(fromNodeId, toNodeId);
        } else if (from) {
            createNode(from);
        }
    });
    document.getElementById('ar').value = ''; // Clear the textarea
});

// Add event listener for the "Directed" button
document.getElementById('directedButton').addEventListener('click', function() {
    options.edges = {
        arrows: {
            to: true
        }
    };
    network.setOptions(options);
});

// Add event listener for the "Undirected" button
document.getElementById('undirectedButton').addEventListener('click', function() {
    options.edges = {
        arrows: {
            to: false
        }
    };
    network.setOptions(options);
});