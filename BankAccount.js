var rest = require('./RestClient');

exports.createAccount = function openAccount(session, accountName, bankBalance){
    var url = 'https://contoso-backend.azurewebsites.net/tables/contoso_table';
    rest.getBankBalance(url,session, accountName,function(message,session,accountName){
        var allBankBalances = JSON.parse(message);
        var bool = true;
        for(var index in allBankBalances) {
            if (allBankBalances[index].AccountName === accountName) {
                console.log(allBankBalances[index]);
                bool = false;
                break;
            }
        }
        if(bool){
            rest.openAccount(url, accountName, bankBalance);
            session.send("Thanks %s, for opening an account with Contoso Bank", accountName);
        } else{
            session.send("Can't open an account, as you already have one");
        }
    }); 
};

exports.displayBankBalance = function getBankBalance(session, accountName){
    var url = 'https://contoso-backend.azurewebsites.net/tables/contoso_table';
    rest.getBankBalance(url, session, accountName, handleBankBalanceResponse)
};

function handleBankBalanceResponse(message, session, accountName) {
    var bankBalanceResponse = JSON.parse(message);
    var bankBalance = [];
    var bool = false;
    for (var index in bankBalanceResponse) {
        var accountNameReceived = bankBalanceResponse[index].AccountName;
        var bankBalanceReceived = bankBalanceResponse[index].BankBalance;

        //Convert account names to lowercase for comparison
        if (accountName.toLowerCase() === accountNameReceived.toLowerCase()) {
            bankBalance.push("$"+bankBalanceReceived);
            bool = true;
        }        
    }
    if(bool){
        // Print account balances for the user that is currently logged in
        session.send("%s, your account balance is standing at: %s", accountName, bankBalance);
    } else{
        session.send("Can't retrieve your balance, as you don\'t have an account");
    }
    
}

exports.deleteAccount = function closeAccount(session,accountName){
    var url  = 'https://contoso-backend.azurewebsites.net/tables/contoso_table';
    rest.getBankBalance(url,session, accountName,function(message,session,accountName){
        var allBankBalances = JSON.parse(message);
        var bool = false;
        for(var index in allBankBalances) {
            if (allBankBalances[index].AccountName === accountName) {
                bool = true;
                console.log(allBankBalances[index]);
                rest.closeAccount(url,session,accountName,allBankBalances[index].id ,handleDeleteBankBalance);
                break;
            }
        }
        if (!bool){
            session.send("Can\'t close account, as you don\'t have one");
        }
    });
};

function handleDeleteBankBalance(message, session, accountName){
    session.send("Closed %s's bank account",accountName);
}

exports.updateAccount = function openAccount(session,accountName,value){
    var url  = 'https://contoso-backend.azurewebsites.net/tables/contoso_table';
    var updatedBalance = Number(0);
    rest.getBankBalance(url,session, accountName,function(message,session,accountName){
        var allBankBalances = JSON.parse(message);
        var bool = false;
        for(var index in allBankBalances) {
            var accountNameReceived = allBankBalances[index].AccountName;
            var bankBalance = allBankBalances[index].BankBalance;
            if (accountNameReceived === accountName && allBankBalances[index].deleted === false) {
                bool = true;
                console.log(allBankBalances[index]);
                updatedBalance = Number(bankBalance);
                rest.closeAccount(url,session,accountName,allBankBalances[index].id,handleUpdatedBankBalance)
                rest.openAccount(url, accountName, Number(updatedBalance+value))
                break;
            }
        }
        if (!bool){
            session.send("Can\'t update your account, as you don\'t have one");
        }
    });
    
};

function handleUpdatedBankBalance(message, session, accountName){
    session.send("Updated %s's bank account",accountName);
}