var rest = require('./RestClient');

exports.createAccount = function openAccount(session, accountName){
    var url = 'https://contoso-backend.azurewebsites.net/tables/contoso_table';
    rest.openAccount(url, accountName);
};