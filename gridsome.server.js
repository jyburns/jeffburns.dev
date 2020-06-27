module.exports = function (api) {
    api.loadSource(async actions => {
      const Theme = require('./data/theme.json');
  
      const collection = actions.addCollection({
        typeName: 'Theme'
      })
  
      collection.addNode(Theme);
    })
  }