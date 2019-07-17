// const asyncMiddlware = route => (req, res, next) => {
//     Promise.resolve(route(req, res)).catch(next);
// }

function asyncMiddlware(route) {
    return function (req, res, next) {
        Promise.resolve(route(req, res)).catch(next);
    }
}

module.exports = asyncMiddlware;