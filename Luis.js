var builder = require('botbuilder');
var rates = require("./ExchangeRates");
var account = require("./BankAccount");

exports.startDialog = function(bot){
    
    // LUIS App id and key
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/cc34d043-0db1-47bb-a47c-f8ee78c06861?subscription-key=745456b351264479a9463365244befec&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

    bot.dialog('OpenAccount', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["AccountName"]) {
                builder.Prompts.text(session, "Enter an account name to setup your account.");                
            } else {
                next(); // Goto next waterfall step, if already have name.
            }
            next(); // Goto next function
        },
        function(session, results, next){
            if(results.response){
                session.conversationData["AccountName"] = results.response;
            }
            account.createAccount(session, session.conversationData["AccountName"], Number(0));
        }
    ]).triggerAction({
        matches: 'OpenAccount'
    });

    bot.dialog('CloseAccount', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["AccountName"]) {
                builder.Prompts.text(session, "Enter an account name to setup your account.");                
            } else {
                next(); // Goto next waterfall step, if already have name.
            }
            next(); // Goto next function
        },
        function(session,results,next){
            if(results.response){
                session.conversationData["AccountName"] = results.response;
            }
            account.deleteAccount(session,session.conversationData["AccountName"]);
        }
    ]).triggerAction({
        matches: 'CloseAccount'
    });

    bot.dialog('GetBankBalance', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["AccountName"]) {
                builder.Prompts.text(session, "Enter an account name to setup your account.");                
            } else {
                next(); // Goto next waterfall step, if already have name.
            }
            next(); // Goto next function
        },
        function (session, results, next) {
            if (results.response) {
                session.conversationData["AccountName"] = results.response;
            }
            session.send("Retrieving your bank balance");
            account.displayBankBalance(session, session.conversationData["AccountName"]);
        }
    ]).triggerAction({
        matches: 'GetBankBalance'
    });

    bot.dialog('Deposit', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["AccountName"]) {
                builder.Prompts.text(session, "Enter an account name to setup your account.");                
            } else {
                next(); // Goto next waterfall step, if already have name.
            }
            next(); // Goto next function
        },
        function(session,results,next){
            if (results.response) {
                session.conversationData["AccountName"] = results.response;
            }
            var valueEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'value');
            if (valueEntity) {
                session.send("Depositing $"+valueEntity.entity+" into your account...");
                account.updateAccount(session, session.conversationData["AccountName"], Number(valueEntity.entity));

            } else {
                session.send("No amount has been specified!");
            }
        }
    ]).triggerAction({
        matches: 'Deposit'
    });

    bot.dialog('Withdrawal', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["AccountName"]) {
                builder.Prompts.text(session, "Enter an account name to setup your account.");                
            } else {
                next(); // Goto next waterfall step, if already have name.
            }
            next(); // Goto next function
        },
        function(session,results,next){
            if (results.response) {
                session.conversationData["AccountName"] = results.response;
            }
            var valueEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'value');
            if (valueEntity) {
                session.send("Withdrawing $"+valueEntity.entity+" from your account...");
                account.updateAccount(session, session.conversationData["AccountName"], Number(-valueEntity.entity));

            } else {
                session.send("No amount has been specified!");
            }
        }
    ]).triggerAction({
        matches: 'Withdrawal'
    });

    bot.dialog('ExchangeRate', [
        function(session,args){
            var fromCurrencyEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'fromCurrency');
            var toCurrencyEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'toCurrency');
            if (fromCurrencyEntity&&toCurrencyEntity) {
                session.send('Calculating conversion rates...');
                rates.displayExchangeRateCards(fromCurrencyEntity.entity, toCurrencyEntity.entity, session);

            } else {
                session.send("No currencies identified! Please try and rephrase that again");
            }
        }
    ]).triggerAction({
        matches: 'ExchangeRate'
    });

    bot.dialog('Welcome', function (session, args){
        session.send("Hello, how can I help you?");
    }).triggerAction({
        matches: 'Welcome'
    });
}