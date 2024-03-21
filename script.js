// DATA
const airports = 'PHX BKK OKC JFK LAX MEX EZE HEL LOS LAP LIM'.split(' ');

const routes = [
    ['PHX', 'LAX'],
    ['PHX', 'JFK'],
    ['JFK', 'OKC'],
    ['JFK', 'HEL'],
    ['JFK', 'LOS'],
    ['MEX', 'LAX'],
    ['MEX', 'BKK'],
    ['MEX', 'LIM'],
    ['MEX', 'EZE'],
    ['LIM', 'BKK'],
];

// The graph
const adjacencyList = new Map();

// Add node
function addNode(airport) {
    adjacencyList.set(airport, []);
}

// Add edge, undirected
function addEdge(origin, destination) {
    adjacencyList.get(origin).push(destination);
    adjacencyList.get(destination).push(origin);
}

// Create the Graph
airports.forEach(addNode);
routes.forEach(route => addEdge(...route));

console.log(adjacencyList);

//--------------------------------------------

function dfs(start, visited = new Set()) {
    console.log(start);
    visited.add(start);

    const graph = document.getElementById('graph');
    const node = document.createElement('div');
    node.classList.add('node');
    node.textContent = start;

    if (start === 'BKK') {
        node.classList.add('final');
    }

    if (visited.size === airports.length) {
        node.classList.add('active');
    }

    graph.appendChild(node);

    const destinations = adjacencyList.get(start);

    for (const destination of destinations) {
        if (!visited.has(destination)) {
            dfs(destination, visited);
        }
    }
}

dfs('PHX');