export function compareTotalScoreAndPenalty(a, b) {
    if (a.totalScore === b.totalScore) {
        return (a.penalty || Infinity) - (b.penalty || Infinity);
    }
    return (b.totalScore || -Infinity) - (a.totalScore || -Infinity);
}

export function compareContestUsers(a, b) {
    if (a.haveSubmitted() !== b.haveSubmitted()) {
        return b.numSubmissions - a.numSubmissions;
    } else {
        return compareTotalScoreAndPenalty(a, b);
    }
}