const path = require('path')
const rootPath = path.resolve(__dirname, '..', 'src')
module.exports = ({ config }) => {
    config.resolve.alias['@'] = rootPath
    return config
}
