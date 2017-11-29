var expect  = require("chai").expect;
var request = require("request");
var rest = require('../RestClient');

describe("Contoso Chatbot", function() {

    describe("Open account", function() {

        var url = "https://contoso-backend.azurewebsites.net/tables/contoso_table";

        it("Returns status 200", function(done) {
            var options = {
                url: url,
                method: 'POST',
                headers: {
                    'ZUMO-API-VERSION': '2.0.0',
                    'Content-Type':'application/json'
                },
                json: {
                    "AccountName" : "user1",
                    "BankBalance" : 985
                }
            };
            
            request(options, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
            });
        });
    });

    describe("Closing account", function() {
        var url = "https://contoso-backend.azurewebsites.net/tables/contoso_table";

        it("Returns status 200", function(done) {
            var options = {
                url: url + "\\" + "2d46caf9-a171-45b2-a8c2-6f9e786cba1d",
                method: 'DELETE',
                headers: {
                    'ZUMO-API-VERSION': '2.0.0',
                    'Content-Type':'application/json'
                }
            };

            request(options, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
            });
        });
    });
});