var rest = require('./RestClient');
var builder = require('botbuilder');

exports.displayExchangeRateCards = function getExchangeRateData(fromCurrency,toCurrency,session){
    var url = "https://free.currencyconverterapi.com/api/v5/convert?q="+fromCurrency+"_"+toCurrency;
    rest.getExchangeRateData(url,session,fromCurrency,toCurrency,displayExchangeRateCards);
}

function displayExchangeRateCards(message,fromCurrency,toCurrency,session){
    var exchangeRate = JSON.parse(message);
    var conversionRate = 0;
    for(var index in exchangeRate.results){
        var rate = exchangeRate.results[index];
        conversionRate = rate.val;
    }
    var string1 = fromCurrency.toUpperCase() + " to " + toCurrency.toUpperCase();
    var string2 = "1 "+fromCurrency.toUpperCase()+" is equal to "+conversionRate+" "+toCurrency.toUpperCase();
    session.send(new builder.Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.0",
            "body": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Currency Converter",
                            "weight": "bolder",
                            "size": "large"
                        }
                    ]
                },
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Converts between currencies",
                            "wrap": true
                        },
                        {
                            "type": "FactSet",
                            "facts": [
                                {
                                    "title": string1,
                                    "value": string2
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }));
}