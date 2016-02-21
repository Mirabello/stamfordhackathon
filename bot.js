var watson = require('watson-developer-cloud');
var apis = require('./lib/config.js')(watson);


var Botkit = require('./lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: true,
});

var bot = require('./lib/botconfig.js')(controller);


controller.on('ambient',function(bot, message) {
    console.log(JSON.stringify(message));
    if (message.type !== "message") return false;
   apis.tone_analyzer.tone({text: message.text}, function(err, tone){
        var anger = tone.document_tone.tone_categories[0].tones[0].score;
        var disgust = tone.document_tone.tone_categories[0].tones[1].score;
        var fear = tone.document_tone.tone_categories[0].tones[2].score;
        var joy = tone.document_tone.tone_categories[0].tones[3].score;
        var sadness = tone.document_tone.tone_categories[0].tones[4].score;
        var proportion = 0.2;
        var responses = {
            "anger": "Settle down! There is no reason to be angry",
            "disgust": "yeah.....ewww",
            "fear": "Don't be scared",
            "joy":"It looks like you are feeling happy today. Good stuff!",
            "sadness": "Don't be sad. I am here to comfort you!"
        };
        var response_message = "";

        if(joy > proportion){
            response_message = responses.joy;
        }else if(anger > proportion){
            response_message = responses.anger;
        }else if(disgust > proportion){
            response_message = responses.disgust;
        }else if(fear > proportion){
            response_message = responses.fear;
        }else if(sadness > proportion){
            response_message = responses.sadness;
        }
        bot.reply(message, response_message);
    });
});


var loop = function(container){
    var analysis = "";
    for (var idx = container.length; idx--;){
        if (container[idx].tones){
            loop(container[idx].tones);
        }else{
            analysis += container[idx].toString();
            console.log(analysis);
        }
    }
    return analysis;

};
//controller.hears(['what is my name','who am i'],'direct_message,direct_mention,mention',function(bot, message) {

    //controller.storage.users.get(message.user,function(err, user) {
        //if (user && user.name) {
            //bot.reply(message,'Your name is ' + user.name);
        //} else {
            //bot.reply(message,'I don\'t know yet!');
        //}
    //});
//});

