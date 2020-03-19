async function minifyCss(css) {
    return css
        .replace(/\/\*.*\*\//g, '')
        .split(/\n/g)
        .map(line =>
            line
                .replace(/^\s+/g, '')
                .replace(/\s+$/g, '')
        )
        .join('')

}

module.exports = minifyCss
