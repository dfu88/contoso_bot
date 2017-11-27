var rest = require('./RestClient');

exports.createAccount = function openAccount(session, accountName, bankBalance){
    var url = 'https://contoso-backend.azurewebsites.net/tables/contoso_table';
    rest.openAccount(url, accountName, bankBalance);
};

exports.displayBankBalance = function getBankBalance(session, accountName){
    var url = 'https://contoso-backend.azurewebsites.net/tables/contoso_table';
    rest.getBankBalance(url, session, accountName, handleBankBalanceResponse)
};

function handleBankBalanceResponse(message, session, accountName) {
    var bankBalanceResponse = JSON.parse(message);
    var allBankBalances = [];
    var counter = 1;
    for (var index in bankBalanceResponse) {
        var accountNameReceived = bankBalanceResponse[index].AccountName;
        var bankBalance = bankBalanceResponse[index].BankBalance;

        //Convert account names to lowercase for comparison
        if (accountName.toLowerCase() === accountNameReceived.toLowerCase()) {
            if(bankBalanceResponse.length - 1) {
                allBankBalances.push("Account Balance: $"+bankBalance);
                counter++;
            }
            else {
                allBankBalances.push("Account Balance: $"+bankBalance+",");
                counter++;
            }
        }        
    }
    // Print account balances for the user that is currently logged in
    session.send("%s, your account balances are: %s", accountName, allBankBalances);
}

exports.deleteAccount = function closeAccount(session,accountName){
    var url  = 'https://contoso-backend.azurewebsites.net/tables/contoso_table';
    rest.getBankBalance(url,session, accountName,function(message,session,accountName){
        var allBankBalances = JSON.parse(message);
        for(var index in allBankBalances) {
            if (allBankBalances[index].AccountName === accountName) {
                console.log(allBankBalances[index]);
                rest.closeAccount(url,session,accountName,allBankBalances[index].id ,handleDeleteBankBalanceResponse)
            }
        }
    });
};

function handleDeleteBankBalanceResponse(message, session, accountName){
    session.send("Closed %s's bank account",accountName);
}

exports.updateAccount = function openAccount(session,accountName,value){
    var url  = 'https://contoso-backend.azurewebsites.net/tables/contoso_table';
    var updatedBalance = Number(0);
    rest.getBankBalance(url,session, accountName,function(message,session,accountName){
        var allBankBalances = JSON.parse(message);
        for(var index in allBankBalances) {
            var accountNameReceived = allBankBalances[index].AccountName;
            var bankBalance = allBankBalances[index].BankBalance;
            if (accountNameReceived === accountName && allBankBalances[index].deleted === false) {
                console.log(allBankBalances[index]);
                updatedBalance = Number(bankBalance);
                rest.closeAccount(url,session,accountName,allBankBalances[index].id,handleUpdatedBankBalanceResponse)
                rest.openAccount(url, accountName, Number(updatedBalance+value))
                break;
            }
        }
    });
    
};

function handleUpdatedBankBalanceResponse(message, session, accountName){
    session.send("Updated %s's bank account",accountName);
}