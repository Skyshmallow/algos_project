import {
    distance
} from "../../stemjs/src/math.js";

class CSAForceLayout {
    getDefaultOptions() {
        return {
            chargeStrength: 10,
            edgeStrength: 15,
            gravityStrength: 0.007,
            idealEdgeDistance: 140, // it used to be 140
            repulsionDistance: 140
        }
    }

    constructor(options) {
        this.setOptions(options);
    }

    setOptions(options) {
        this.options = Object.assign(this.getDefaultOptions(), options);
        this.points = this.options.points;
        this.edges = this.options.edges;
        this.gravityCenter = this.options.gravityCenter;
        this.adjMatrix = this.buildAdjacencyMatrix();
    }

    buildAdjacencyMatrix() {
        // Create a bi-dimensional matrix, initialize with false
        let adjMatrix = Array(this.points.length).fill().map(() => Array(this.points.length).fill(false));

        for (let i = 0; i < this.edges.length; i += 1) {
            adjMatrix[this.edges[i].first][this.edges[i].second] = true;
            adjMatrix[this.edges[i].second][this.edges[i].first] = true;
        }
        return adjMatrix;
    }

    idealEdgeDistance() {
        return this.options.idealEdgeDistance;
    }

    repulsionDistance() {
        return this.options.repulsionDistance;
    }

    updateVectors(point1, point2, attractionForce) {
        let dx = point2.x - point1.x;
        let dy = point2.y - point1.y;
        let vectorSize = Math.sqrt(dx * dx + dy * dy);
        if (vectorSize < 1e-9) {
            let angle = Math.random() * 2 * Math.PI;
            dx = Math.sin(angle);
            dy = Math.cos(angle);
            vectorSize = 1;
        }
        point1.dx += attractionForce * dx / vectorSize;
        point1.dy += attractionForce * dy / vectorSize;

        point2.dx += -attractionForce * dx / vectorSize;
        point2.dy += -attractionForce * dy / vectorSize;
    }

    calculateAttractions(points) {
        for (let i = 0; i < points.length; i += 1) {
            for (let j = i + 1; j < points.length; j += 1) {
                let dist = distance(points[i], points[j]);
                // If there is an edge between the points try to bring the distance between them closer to the ideal edge distance
                if (this.adjMatrix[i][j]) {
                    let force = (dist < 1e-9 ? 1000 : this.options.edgeStrength * (dist - this.idealEdgeDistance()) / dist);
                    this.updateVectors(points[i], points[j], force);
                }
                // If there is no edge between the points, they mustn't be closer than the repulsionDistance.
                else {
                    if (dist < this.repulsionDistance()) {
                        let force = (dist < 1e-9 ? 1000 : this.options.chargeStrength * (dist - this.repulsionDistance()) / dist);
                        this.updateVectors(points[i], points[j], force);
                    }
                }
            }
        }
    }

    gravitateTowards(points, center) {
        for (let i = 0; i < points.length; i += 1) {
            let dist = distance(points[i], center);
            this.updateVectors(points[i], center, dist * this.options.gravityStrength);
        }
    }

    calculateVectors(numIterations) {
        let points = [];
        for (let i = 0; i < this.points.length; i += 1) {
            points.push({
                x: this.points[i].x,
                y: this.points[i].y,
                dx: 0,
                dy: 0
            });
        }

        numIterations = numIterations || 1;

        for (let iter = 0; iter < numIterations; iter += 1) {
            for (let i = 0; i < points.length; i += 1) {
                points[i].x += points[i].dx;
                points[i].y += points[i].dy;
                points[i].dx = 0;
                points[i].dy = 0;
            }
            this.calculateAttractions(points);
            if (this.options.gravityCenter) {
                this.gravitateTowards(points, this.options.gravityCenter);
            }
        }

        return points;
    }

    //TODO(@all): These commented functions are part of Mihai's implementation of the Force Layout. It looks cool but it's unstable.
    //TODO(@all): For instance, a cycle with three nodes will go batshit crazy.
    //TODO(@all): Find a way to make his approach work(be stable).

    //normalizeOptions() {
    //    let maxSize = Math.max(this.options.box.x2 - this.options.box.x1, this.options.box.y2 - this.options.box.y1);
    //    this.options.chargeStrength *= maxSize * maxSize / 4.0;
    //
    //    this.options.gravityStrength /= this.points.length;
    //    if (this.edges.length > 0) {
    //        this.options.edgeStrength /= this.edges.length;
    //    }
    //    if (this.points.length > 1) {
    //        this.options.chargeStrength /= this.points.length * (this.points.length - 1) / 2.0;
    //    }
    //}

    //calculateEdgeAttractions(points, edges) {
    //    for (let k = 0; k < edges.length; k += 1) {
    //        let i = edges[k].first, j = edges[k].second;
    //        let dist = math.distance(points[i], points[j]);
    //        let force = dist * this.options.edgeStrength;
    //        this.updateVectors(points[i], points[j], force);
    //        this.updateVectors(points[j], points[i], force);
    //    }
    //}

    //calculateCharges(points) {
    //    for (let i = 0; i < points.length; i += 1) {
    //        for (let j = i + 1; j < points.length; j += 1) {
    //            let dist = math.distance(points[i], points[j]);
    //            if (dist < 1e-2) {
    //                let force = 1e2 * points[i].charge * points[j].charge * this.options.chargeStrength;
    //                this.updateVectors(points[i], {x: -1, y: -1}, force);
    //                this.updateVectors(points[j], {x: 1, y: 1}, force);
    //            } else {
    //                let force = -(1.0 / dist) * points[i].charge * points[j].charge * this.options.chargeStrength;
    //                this.updateVectors(points[i], points[j], force);
    //                this.updateVectors(points[j], points[i], force);
    //            }
    //        }
    //    }
    //}
}

export {
    CSAForceLayout
};