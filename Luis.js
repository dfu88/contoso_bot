var builder = require('botbuilder');
var account = require("./BankAccount");

exports.startDialog = function (bot) {
    
    // LUIS App id and key
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/cc34d043-0db1-47bb-a47c-f8ee78c06861?subscription-key=745456b351264479a9463365244befec&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

    bot.dialog('Welcome', function (session, args){
        session.send("Welcome Intent");
    }).triggerAction({
        matches: 'Welcome'
    });

    bot.dialog('OpenAccount', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["AccountName"]) {
                builder.Prompts.text(session, "Enter an account name to setup your account.");                
            } else {
                next(); // Goto next waterfall step, if already have name.
            }
        },
        function(session, results, next){
            if(results.response){
                session.conversationData["AccountName"] = results.response;
            }
            session.send("Thanks for opening an account with Contoso Bank");
            account.createAccount(session, session.conversationData["AccountName"]);
        }
    ]).triggerAction({
        matches: 'OpenAccount'
    });

    bot.dialog('CloseAccount', [
    // Insert favourite food logic here later
    ]).triggerAction({
        matches: 'CloseAccount'
    });

    bot.dialog('GetBankBalance', [
    // Insert favourite food logic here later
    ]).triggerAction({
        matches: 'GetBankBalance'
    });

    bot.dialog('Deposit', [
    // Insert favourite food logic here later
    ]).triggerAction({
        matches: 'Deposit'
    });

    bot.dialog('Withdrawal', [
    // Insert favourite food logic here later
    ]).triggerAction({
        matches: 'Withdrawal'
    });

    bot.dialog('ExchangeRate', [
    // Insert favourite food logic here later
    ]).triggerAction({
        matches: 'ExchangeRate'
    });
}