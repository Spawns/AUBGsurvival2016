Handlebars.registerHelper('gameRunning', function () {
    var gameState = GameState.findOne({});
    if (gameState) {
      if(gameState.state) {
          return true;
      } else {
          return false;
      }
    }
});
