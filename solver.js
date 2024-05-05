function start_end_sort(a, b) {
    if (a[0] === b[0]) {
        return a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0;
    }
    return a[0] > b[0] ? 1 : -1;
}

function end_start_sort(a, b) {
    if (a[1] === b[1]) {
        return a[0] < b[0] ? 1 : a[0] > b[0] ? -1 : 0;
    }
    return a[1] > b[1] ? 1 : -1;
}

export class Solver {
    constructor () {
        this.task = null;
        this.solvable = null;
        this.solution = [];
    }

    solveTask(areas) {
        const n = areas.length;
        const x_intervals = [];
        const y_intervals = [];
        for (let i = 0; i < n; i++) {
            x_intervals.push([areas[i][0], areas[i][2], i]);
            y_intervals.push([areas[i][1], areas[i][3], i]);
        }        
        const x_solution = this.#solveIntervals(x_intervals);
        const y_solution = this.#solveIntervals(y_intervals);
        if (this.#check(x_solution, x_intervals) && this.#check(y_solution, y_intervals)) {
            this.solvable = true;
        } else {
            this.solvable = false;
        }
    }

    #solveIntervals(intervals) {
        const n = intervals.length;
        const solution = Array(n).fill(-1);
        const start_end = [...intervals];
        const end_start = [...intervals];
        start_end.sort(start_end_sort);
        end_start.sort(end_start_sort);
        let i = 0;
        let j = 0;
        let cur = 0;
        while (i < n && j < n) {
            const interval_i = start_end[i];
            const interval_j = end_start[j];
            if (solution[interval_i[2]] !== -1) {
                i++;
                continue;
            }
            if (solution[interval_j[2]] !== -1) {
                j++;
                continue;
            }
            const start_i = Math.max(interval_i[0], cur);
            const start_j = Math.max(interval_j[0], cur);
            const end_i = interval_i[0];
            const end_j = interval_j[0];
            if (start_i < start_j) {
                solution[interval_i[2]] = cur;
                i++;
            } else if (start_j < start_i) {
                solution[interval_j[2]] = cur;
                j++;
            } else if (end_i < end_j) {
                solution[interval_i[2]] = cur;
                i++;
            } else {
                solution[interval_j[2]] = cur;
                j++;
            }
            cur++;
        }
        return solution;
    }

    #check(solution, intervals) {
        for (let i = 0; i < intervals.length; i++) {
            const cur = solution[i];
            if (cur < intervals[i][0] || cur > intervals[i][1])
                return false;
        }
        return true;
    }

    isSolvable() {
        return this.solvable;
    }

    getsolution() {
        if (solvable) {
            return this.solution;
        }
    }
}