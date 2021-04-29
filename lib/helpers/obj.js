const pick = (o, ...args) => {
    if (!(o && Object.keys(o).length)) return o;
    if (args[0] instanceof Array)
        args = [...args[0]];
    if (!args || !args.length) return o;
    return args.reduce(
        (acc, key) => {
            acc[key] = o[key];
            return acc;
        }, {});
};

const isEmpty = o => !Object.keys(o).length
module.exports = {
    pick,
    isEmpty
}