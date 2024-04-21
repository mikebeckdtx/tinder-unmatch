const TinderClient = require('./tinder.js')
const client = new TinderClient();
client.authorize(
  "FACEBOOK_ACCESS_TOKEN",
  'FACEBOOK_ID',
  function() {
    client.getHistory(function(error, data){
        var matches = data.matches;
        var matchesWithoutMessages = matches.filter(function(match){
            return match.last_activity_date < '2024-01-01T00:00:00Z' ||
                match.messages.length === 0;
        });
        var idsToUnmatch = matchesWithoutMessages.map(function(match) {
            return match["_id"];
        });
        var interval;
        var interval = setInterval(function(){
            var idToUnmatch = idsToUnmatch.splice(0,1);
            console.log("unmatching" + " " + idToUnmatch);
            console.log(idsToUnmatch.length + " matches left to unmatch");
            client.unmatch(idToUnmatch, function(){
                console.log("left: " + idsToUnmatch.length);
            });
            if (idsToUnmatch.length === 0) {
                    clearInterval(interval);
            }
        }, 1000)
    });
});
