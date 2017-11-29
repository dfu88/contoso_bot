var request = require('request'); //node module for http post requests

exports.getMessage = function (session){

    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/c8753691-6547-43ea-99c2-0add0b4a447f/url?iterationId=a89cfe57-5a7b-4784-82fb-42ab0d1ee744',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': '12b7887e7e07415f9819c8000c6de358'
        },
        body: { 'Url': session.message.text }
    }, function(error, response, body){
        console.log(validResponse(body));
        session.send(validResponse(body));
    });
}

function validResponse(body){
    if (body && body.Predictions && body.Predictions[0].Tag){
        return "Type of money " + body.Predictions[0].Tag
    } else{
        console.log('Wasn\'t recognised, please try again!');
    }
}