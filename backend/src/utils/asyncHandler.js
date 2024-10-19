const asyncHadler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => next(err) )
    }
}

export { asyncHadler }
