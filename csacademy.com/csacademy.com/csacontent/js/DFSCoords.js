export function computeDFSCoordsUndirected(graph, startNode = null) {
    let box = graph.getBox();
    let finalCoords = new Map();
    let visited = new Set();
    let subtreeWidth = new Map();
    let level = new Map();
    let sons = new Map();
    const marginUp = 30;
    const marginDown = 80;
    let buildDfsTree = (node, father = -1) => {
        // Calculate the level of current node
        if (father === -1) {
            level.set(node, 0);
        } else {
            level.set(node, level.get(father) + 1);
        }

        // Go through the incident edges to find node's sons
        sons.set(node, []);
        visited.add(node);
        let edges = node.getIncidentEdges();
        for (let i = 0; i < edges.length; i += 1) {
            let neighbour = ((edges[i].getTarget() === node) ? edges[i].getSource() : edges[i].getTarget());

            // If it's a son, call recursively
            if (!visited.has(neighbour)) {
                sons.get(node).push(neighbour);
                buildDfsTree(neighbour, node);
            }
        }
    };

    let computeSubtreeWidth = (node) => {
        subtreeWidth.set(node, 0);

        // Width of a subtree is the sum of widths of the root's sons
        let currentSons = sons.get(node);
        for (let i = 0; i < currentSons.length; i += 1) {
            computeSubtreeWidth(currentSons[i]);
            subtreeWidth.set(node, subtreeWidth.get(node) + subtreeWidth.get(currentSons[i]));
        }

        // Leaf: width = 1
        if (subtreeWidth.get(node) === 0) {
            subtreeWidth.set(node, 1);
        }
    };

    let computeFinalX = (node, leftX, rightX) => {
        if (!finalCoords.has(node)) {
            finalCoords.set(node, {});
        }
        // Place node at the center of its given interval
        finalCoords.get(node).x = (leftX + rightX) / 2;

        // Assign to each son an interval proportional to its width
        let unitLen = (rightX - leftX) / (subtreeWidth.get(node));
        let sonLeftX = leftX;
        let currentSons = sons.get(node);
        for (let i = 0; i < currentSons.length; i += 1) {
            computeFinalX(currentSons[i], sonLeftX, sonLeftX + unitLen * subtreeWidth.get(currentSons[i]));
            sonLeftX += unitLen * subtreeWidth.get(currentSons[i]);
        }
    };
    let computeFinalY = () => {
        // Calculate the depth of the lowest node of the tree
        let depth = 1;
        for (let i = 0; i < graph.nodes.length; i += 1) {
            depth = Math.max(depth, 1 + level.get(graph.nodes[i]));
        }

        // Calculate the space I can leave between two levels of nodes
        let levelDiff;
        if (depth > 1) {
            levelDiff = (box.height - marginUp - marginDown) / (depth - 1);
        } else {
            levelDiff = 0;
        }

        // Assign the y of every node proportional to its level
        for (let i = 0; i < graph.nodes.length; i += 1) {
            let node = graph.nodes[i];
            if (!finalCoords.has(node)) {
                finalCoords.set(node, {});
            }
            finalCoords.get(node).y = box.y + marginUp + levelDiff * level.get(node);
        }
    };

    // Simulate a DFS to build the tree
    if (startNode) {
        buildDfsTree(startNode);

        // Calculate the maximum number of vertices on any level
        // of a node's subtree
        computeSubtreeWidth(startNode);

        // Compute the final coordinates of the nodes
        computeFinalX(startNode, box.x, box.x + box.width);
    } else {
        let treeWidth = 0;
        let roots = [];
        for (let i = 0; i < graph.nodes.length; i += 1) {
            if (!visited.has(graph.nodes[i])) {
                buildDfsTree(graph.nodes[i]);

                computeSubtreeWidth(graph.nodes[i]);
                treeWidth += subtreeWidth.get(graph.nodes[i]);
                roots.push(graph.nodes[i]);
            }
        }
        let unitLen = box.width / treeWidth;
        let sonLeftX = box.x;
        for (let root of roots) {
            let sonRightX = sonLeftX + unitLen * subtreeWidth.get(root);
            computeFinalX(root, sonLeftX, sonRightX);
            sonLeftX = sonRightX;
        }
    }
    computeFinalY();

    return finalCoords;
}

export function computeDFSCoordsDirected(graph, startNode = null, target = {}) {
    let box = graph.getBox();
    let finalCoords = new Map();
    let visited = new Set();
    let subtreeWidth = new Map();
    let level = new Map();
    let sons = new Map();
    target.nodeFathers = new Map();
    const marginUp = 30;
    const marginDown = 80;

    // Build the same tree as the DFS Player
    let buildDfsTree = (node, father = -1) => {
        if (father === -1) {
            level.set(node, 0);
        } else {
            level.set(node, level.get(father) + 1);
            target.nodeFathers.set(node, father);
        }
        sons.set(node, []);
        visited.add(node);
        let edges = node.getIncidentEdges();
        for (let i = 0; i < edges.length; i += 1) {
            if (edges[i].getTarget() === node) {
                continue;
            }
            let neighbour = edges[i].getTarget();
            if (!visited.has(neighbour)) {
                sons.get(node).push(neighbour);
                buildDfsTree(neighbour, node);
            }
        }
    };

    let computeSubtreeWidth = (node) => {
        subtreeWidth.set(node, 0);

        let currentSons = sons.get(node);
        for (let i = 0; i < currentSons.length; i += 1) {
            computeSubtreeWidth(currentSons[i]);
            subtreeWidth.set(node, subtreeWidth.get(node) + subtreeWidth.get(currentSons[i]));
        }
        if (subtreeWidth.get(node) === 0) {
            subtreeWidth.set(node, 1);
        }
    };
    let computeFinalX = (node, leftX, rightX) => {
        if (!finalCoords.has(node)) {
            finalCoords.set(node, {});
        }
        finalCoords.get(node).x = (leftX + rightX) / 2;

        let unitLen = (rightX - leftX) / (subtreeWidth.get(node));
        let sonLeftX = leftX;
        let currentSons = sons.get(node);
        for (let i = 0; i < currentSons.length; i += 1) {
            computeFinalX(currentSons[i], sonLeftX, sonLeftX + unitLen * subtreeWidth.get(currentSons[i]));
            sonLeftX += unitLen * subtreeWidth.get(currentSons[i]);
        }
    };
    let computeFinalY = () => {
        let depth = 1;
        for (let i = 0; i < graph.nodes.length; i += 1) {
            depth = Math.max(depth, 1 + level.get(graph.nodes[i]));
        }
        let levelDiff;
        if (depth > 1) {
            levelDiff = (box.height - marginUp - marginDown) / (depth - 1);
        } else {
            levelDiff = 0;
        }
        for (let i = 0; i < graph.nodes.length; i += 1) {
            let node = graph.nodes[i];
            if (!finalCoords.has(node)) {
                finalCoords.set(node, {});
            }
            finalCoords.get(node).y = box.y + marginUp + levelDiff * level.get(node);
        }
    };

    target.roots = [];
    let treeWidth = 0;
    for (let i = 0; i < graph.nodes.length; i += 1) {
        if (!visited.has(graph.nodes[i])) {
            target.roots.push(graph.nodes[i]);
            buildDfsTree(graph.nodes[i]);
        }
    }
    for (let i = 0; i < target.roots.length; i += 1) {
        computeSubtreeWidth(target.roots[i]);
        treeWidth += subtreeWidth.get(target.roots[i]);
    }
    let unitLen = box.width / treeWidth;
    let sonLeftX = box.x;

    // Get the x coordinates of each root's subtree
    for (let i = 0; i < target.roots.length; i += 1) {
        let sonRightX = sonLeftX + unitLen * subtreeWidth.get(target.roots[i]);
        computeFinalX(target.roots[i], sonLeftX, sonRightX);
        sonLeftX = sonRightX;
    }

    // Compute each node's y coordinate
    computeFinalY();

    return finalCoords;
}