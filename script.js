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
var data = { nodes: nodes, edges: edges };
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


// Get the audio element
const audioElement = document.getElementById('soundEffect');

// Function to play the match-lighting sound
function playMatchSound() {
    // Set the current time of the audio to 0 (to restart the sound)
    audioElement.currentTime = 0;

    // Set the source to the match-lighting sound file
    audioElement.src = 'fire-torch-whoosh-2-186586.mp3';

    // Play the sound
    audioElement.play();
}

// Function to play the swipe sound
function playSwipeSound() {
    // Set the current time of the audio to 0 (to restart the sound)
    audioElement.currentTime = 0;

    // Set the source to the swipe sound file
    audioElement.src = 'movement-swipe-whoosh-3-186577.mp3';

    // Play the sound
    audioElement.play();
}




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
function createEdge(fromNode, toNode, directed) {
    edges.add({ from: fromNode, to: toNode, arrows: directed ? 'to' : undefined });
}

// Event listener for the "Enter" button
document.getElementById('button').addEventListener('click', function() {
    let input = document.getElementById('ar').value.trim();
    let lines = input.split('\n');
    let directed = options.edges.arrows.to; // Get the current direction setting

    lines.forEach(line => {
        let [from, to] = line.split(' ');
        if (from && to) {
            let fromNodeId = createNode(from);
            let toNodeId = createNode(to);
            createEdge(fromNodeId, toNodeId, directed);
        } else if (from) {
            createNode(from);
        }
    });
    document.getElementById('ar').value = '';
});

// Function to perform DFS search and animation
function dfsSearch(startNodeLabel, endNodeLabel, directed) {
    const startNode = nodes.get().find(node => node.label === startNodeLabel);
    const endNode = nodes.get().find(node => node.label === endNodeLabel);

    if (!startNode || !endNode) {
        alert(`Node ${startNodeLabel} or ${endNode} not found!`);
        return;
    }

    const visited = new Set();
    const stack = [startNode.id];
    const path = [];
    let delay = 1000; // Delay in milliseconds between each step

    const animateSearch = () => {
        if (stack.length === 0) {
            alert(`No path found from ${startNodeLabel} to ${endNodeLabel}.`);
            return;
        }

        const currentNodeId = stack.pop();
        const currentNode = nodes.get(currentNodeId);

        if (!visited.has(currentNodeId)) {
            visited.add(currentNodeId);
            path.push(currentNodeId);

            // Highlight the current node in red
            network.selectNodes([currentNodeId], { highlightEdges: false });
            network.body.nodes[currentNodeId].setOptions({ color: 'red' });

            if (currentNode.id === endNode.id) {
                // Highlight the end node in green
                network.body.nodes[currentNodeId].setOptions({ color: 'green' });
                alert(`Path found from ${startNodeLabel} to ${endNodeLabel}!`);
                return;
            }

            const neighbors = edges.get({
                filter: (edge) => {
                    if (directed) {
                        return edge.from === currentNodeId;
                    } else {
                        return (edge.from === currentNodeId || edge.to === currentNodeId);
                    }
                }
            }).map(edge => (edge.from === currentNodeId ? edge.to : edge.from));

            stack.push(...neighbors.filter(neighborId => !visited.has(neighborId)));
        }

        setTimeout(animateSearch, delay);
    };

    animateSearch();
}

// Add event listener for the "Directed" button
document.getElementById('directedButton').addEventListener('click', function() {
    options.edges = { arrows: { to: true } };
    network.setOptions(options);
});

// Add event listener for the "Undirected" button
document.getElementById('undirectedButton').addEventListener('click', function() {
    options.edges = { arrows: { to: false } };
    network.setOptions(options);
});

// Event listener for the "Enter" button for DFS search
document.getElementById('button_dfs').addEventListener('click', function() {
    const input = document.getElementById('dfs_find').value.trim();
    const [start, end] = input.split(' ');
    if (start && end) {
        dfsSearch(start, end, options.edges.arrows.to);
    } else {
        alert('Please enter a valid start and end node.');
    }
    document.getElementById('dfs_find').value = '';
});

// Function to reset node colors
function resetNodeColors() {
    network.unselectAll();
    nodes.forEach(node => {
        network.body.nodes[node.id].setOptions({ color: null });
    });
    network.redraw();
}


// Add event listener to the "Clear" button
document.getElementById('button_clear').addEventListener('click', function() {
    // Call the function to reset node colors
    resetNodeColors();

    // Play the swipe sound
    playSwipeSound();
});
// Add event listener to the "Enter" button
document.getElementById('button').addEventListener('click', playMatchSound);

// Add event listener to the DFS "Enter" button
document.getElementById('button_dfs').addEventListener('click', playMatchSound);

// Get the "Clear" button element
const clearButton = document.getElementById('b_clearGraph');

// Add event listener to the "Clear" button
// clearButton.addEventListener('click', clearGraph);
clearButton.addEventListener('click', function(){
    clearGraph();
    playSwipeSound();
});

// Function to clear the graph
function clearGraph() {
    // Clear nodes
    nodes.clear();

    // Clear edges
    edges.clear();

    // Redraw the network with the new data
    network.setData({ nodes: nodes, edges: edges });
}