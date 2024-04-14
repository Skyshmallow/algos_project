// Initialize the vis DataSet with nodes and edges
const nodes = new vis.DataSet(initializeNodes());
const edges = new vis.DataSet(initializeEdges());

// Create a network
const container = document.getElementById('mynetwork');
const options = initializeOptions();
const data = { nodes, edges };
const network = new vis.Network(container, data, options);

// Event listeners
document.getElementById('generate').addEventListener('click', generateRandomGraph);
document.getElementById('button').addEventListener('click', processInput);
document.getElementById('button_dfs').addEventListener('click', performDFS);
document.getElementById('button_clear').addEventListener('click', resetNodeColors);
document.getElementById('b_clearGraph').addEventListener('click', clearGraph);
document.getElementById('start').addEventListener('click', performDFSTraversal);
document.getElementById('directedButton').addEventListener('click', setDirectedEdges);
document.getElementById('undirectedButton').addEventListener('click', setUndirectedEdges);

// Add click event listener to the network
network.on('click', handleNodeClick);

function initializeNodes() {
    return [
        createNode(1, 'Arsen'),
        createNode(2, 'Danial'),
        createNode(3, 'Nurlubek'),
        createNode(4, 'Adil'),
        createNode(5, 'iDOS'),
        createNode(6, 'BSNF')
    ];
}

function createNode(id, label) {
    return {
        id,
        label,
        color: {
            background: 'black',
            border: 'black',
            highlight: { background: 'black', border: 'black' },
            hover: { background: 'black', border: 'black' }
        },
        font: { color: 'white' }
    };
}

function initializeEdges() {
    return [
        { from: 1, to: 4 },
        { from: 1, to: 2 },
        { from: 2, to: 4 },
        { from: 2, to: 5 }
    ];
}

function initializeOptions() {
    return {
        width: '100%',
        height: '400px',
        physics: {
            stabilization: {
                enabled: true,
                iterations: 500
            }
        },
        edges: {
            arrows: { to: false }
        }
    };
}

// Network event handler
function handleNodeClick(properties) {
    if (properties.nodes.length > 0) {
        const nodeId = properties.nodes[0];
        const node = nodes.get(nodeId);
        const newLabel = prompt(`Enter new label for node ${nodeId} (current label: ${node.label})`);
        
        if (newLabel !== null) {
            node.label = newLabel;
            nodes.update(node);
        }
    }
}

// Generate random graph
function generateRandomGraph() {
    nodes.clear();
    edges.clear();

    const numNodes = randomInt(5, 14);
    const numEdges = randomInt(1, numNodes * (numNodes - 1) / 2);

    generateNodes(numNodes);
    generateEdges(numEdges, numNodes);

    network.setData({ nodes, edges });
}

function generateNodes(numNodes) {
    for (let i = 1; i <= numNodes; i++) {
        nodes.add(createNode(i, String.fromCharCode(65 + i - 1)));
    }
}

function generateEdges(numEdges, numNodes) {
    const edgeSet = new Set();

    while (edgeSet.size < numEdges) {
        const from = randomInt(1, numNodes);
        const to = randomInt(1, numNodes);

        if (from !== to && !edgeSet.has(`${from}-${to}`) && !edgeSet.has(`${to}-${from}`)) {
            edges.add({ from, to });
            edgeSet.add(`${from}-${to}`);
        }
    }
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Process user input
function processInput() {
    const input = document.getElementById('ar').value.trim();
    const lines = input.split('\n');
    const directed = options.edges.arrows.to;

    lines.forEach(line => processLine(line, directed));
    document.getElementById('ar').value = '';
    playMatchSound();
}

function processLine(line, directed) {
    const [from, to] = line.split(' ');

    if (from) {
        const fromNodeId = createNodeIfNotExists(from);
        if (to) {
            const toNodeId = createNodeIfNotExists(to);
            createEdgeIfNotExists(fromNodeId, toNodeId, directed);
        }
    }
}

function createNodeIfNotExists(label) {
    const existingNode = nodes.get().find(node => node.label === label);
    if (!existingNode) {
        const newNodeId = nodes.length + 1;
        nodes.add(createNode(newNodeId, label));
        return newNodeId;
    }
    return existingNode.id;
}

function createEdgeIfNotExists(fromNodeId, toNodeId, directed) {
    const existingEdge = edges.get({
        filter: edge => (edge.from === fromNodeId && edge.to === toNodeId) ||
                        (!directed && edge.from === toNodeId && edge.to === fromNodeId)
    });

    if (existingEdge.length === 0) {
        edges.add({ from: fromNodeId, to: toNodeId });
    }
}

// Perform DFS search
function performDFS() {
    const input = document.getElementById('dfs_find').value.trim();
    const [start, end] = input.split(' ');
    if (start && end) {
        dfsSearch(start, end, options.edges.arrows.to);
        playMatchSound();
    } else {
        alert('Please enter a valid start and end node.');
    }
    document.getElementById('dfs_find').value = '';
}

function dfsSearch(startLabel, endLabel, directed) {
    const startNode = nodes.get().find(node => node.label === startLabel);
    const endNode = nodes.get().find(node => node.label === endLabel);

    if (!startNode || !endNode) {
        alert(`Node ${startLabel} or ${endLabel} not found!`);
        return;
    }

    resetNodeColors();
    resetEdgeColors();

    const visitedNodes = new Set();
    const visitedEdges = new Set();
    const stack = [[startNode.id, null]];

    performDFSSearch(stack, endNode.id, visitedNodes, visitedEdges, directed);
}

function performDFSSearch(stack, endNodeId, visitedNodes, visitedEdges, directed) {
    const delay = 1000;

    const animateSearch = () => {
        if (stack.length === 0) {
            alert(`No path found to node with ID ${endNodeId}.`);
            return;
        }

        const [currentNodeId, currentEdgeId] = stack.pop();

        if (!visitedNodes.has(currentNodeId)) {
            visitedNodes.add(currentNodeId);

            network.selectNodes([currentNodeId], { highlightEdges: false });
            network.body.nodes[currentNodeId].setOptions({ color: 'red' });

            if (currentEdgeId !== null) {
                network.body.edges[currentEdgeId].setOptions({ color: 'red' });
                visitedEdges.add(currentEdgeId);
            }

            if (currentNodeId === endNodeId) {
                network.body.nodes[currentNodeId].setOptions({ color: 'green' });
                alert(`Path found from start node to end node!`);
                return;
            }

            const neighbors = getNeighbors(currentNodeId, directed);

            neighbors.forEach(({ neighborId, edgeId }) => {
                if (!visitedNodes.has(neighborId)) {
                    stack.push([neighborId, edgeId]);
                }
            });
        }

        setTimeout(animateSearch, delay);
    };

    animateSearch();
}

// Function to reset edge colors
function resetEdgeColors() {
    edges.forEach(edge => {
        network.body.edges[edge.id].setOptions({ color: null });
    });
    network.redraw();
}


function getNeighbors(currentNodeId, directed) {
    return edges.get({
        filter: edge => directed ? edge.from === currentNodeId : edge.from === currentNodeId || edge.to === currentNodeId
    }).map(edge => {
        const neighborId = edge.from === currentNodeId ? edge.to : edge.from;
        return { neighborId, edgeId: edge.id };
    });
}

// Perform DFS traversal
function performDFSTraversal() {
    const input = document.getElementById('dfs-v').value.trim();
    const startNodeIndex = parseInt(input, 10);

    if (!isNaN(startNodeIndex)) {
        dfsTraversal(startNodeIndex, options.edges.arrows.to);
    } else {
        alert('Please enter a valid start node index.');
    }
    document.getElementById('dfs-v').value = '';
}

function dfsTraversal(startNodeIndex, directed) {
    if (startNodeIndex < 0 || startNodeIndex >= nodes.length) {
        alert(`Invalid start node index!`);
        return;
    }

    const visited = new Set();
    const stack = [nodes.getIds()[startNodeIndex]];

    performTraversal(stack, visited, directed);
}

function performTraversal(stack, visited, directed) {
    const delay = 1000;

    const animateTraversal = () => {
        if (stack.length === 0) {
            alert(`Traversal completed!`);
            return;
        }

        const currentNodeId = stack.pop();
        const currentNode = nodes.get(currentNodeId);

        if (!visited.has(currentNodeId)) {
            visited.add(currentNodeId);

            network.selectNodes([currentNodeId], { highlightEdges: false });
            network.body.nodes[currentNodeId].setOptions({ color: 'red' });

            setTimeout(() => {
                network.body.nodes[currentNodeId].setOptions({ color: 'blue' });

                const neighbors = edges.get({
                    filter: edge => directed ? edge.from === currentNodeId : edge.from === currentNodeId || edge.to === currentNodeId
                }).map(edge => edge.from === currentNodeId ? edge.to : edge.from);

                stack.push(...neighbors.filter(neighborId => !visited.has(neighborId)));
                animateTraversal();
            }, delay);
        }
    };

    animateTraversal();
}

// Graph manipulation functions
function resetNodeColors() {
    nodes.forEach(node => network.body.nodes[node.id].setOptions({ color: 'black' }));
    network.redraw();
}

function resetEdgeColors() {
    edges.forEach(edge => network.body.edges[edge.id].setOptions({ color: null }));
    network.redraw();
}

function clearGraph() {
    nodes.clear();
    edges.clear();
    network.setData({ nodes, edges });
    playSwipeSound();
}

// Sound effects
function playMatchSound() {
    playSound('fire-torch-whoosh-2-186586.mp3');
}

function playSwipeSound() {
    playSound('movement-swipe-whoosh-3-186577.mp3');
}

function playSound(fileName) {
    const audioElement = document.getElementById('soundEffect');
    audioElement.currentTime = 0;
    audioElement.src = fileName;
    audioElement.play();
}

// Set directed/undirected edges
function setDirectedEdges() {
    options.edges.arrows.to = true;
    network.setOptions(options);
}

function setUndirectedEdges() {
    options.edges.arrows.to = false;
    network.setOptions(options);
    removeEdgeArrows();
}

function removeEdgeArrows() {
    edges.forEach(edge => {
        edge.arrows = undefined;
    });
    network.redraw();
}
