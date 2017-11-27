var request = require('request');

exports.openAccount = function getData(url, accountName, bankBalance){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "AccountName" : accountName,
            "BankBalance" : Number(bankBalance)
        }
    };
      
    request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else{
            console.log(error);
        }
    });
};

exports.getBankBalance = function getData(url,session,accountName,callback){
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, accountName);
        }
    });
};

exports.closeAccount = function deleteData(url,session,accountName,id,callback){
    var options = {
        url: url + "\\" + id,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        }
    };

    request(options,function (err, res, body){
        if( !err && res.statusCode === 200){
            console.log(body);
            callback(body,session,accountName);
        }else {
            console.log(err);
            console.log(res);
        }
    })
};