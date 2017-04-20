var mysql = require("mysql");
var inquirer = require("inquirer");
var tto = require('terminal-table-output').create();

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function(error) {
    if (error) throw error;
});

// Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

var displayProducts = function() {
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw error;
        var table = function() {
            // var productArray = [];
            for (var i = 0; i < results.length; i++) {
                // productArray.push(results[i].product_name);
                tto.line()
                tto.pushrow([results[i].item_id, results[i].product_name, parseFloat(results[i].price), results[i].stock_quantity])
                
            }
            tto.line()
            tto.print(true);

            
            // console.log("==========================");
            // console.log(productArray);
            // console.log("==========================");
            // return productArray;
        };

        table();
        greetCustomer();
    });
};

// The app should then prompt users with two messages.
// The first should ask them the ID of the product they would like to buy.

var greetCustomer = function() {

    inquirer.prompt({
        name: "selection",
        type: "input",
        message: "Please enter the ID of the item you wish to purchase."
    }).then(function(user) {
        console.log(user.selection);
    })

};

// The second message should ask how many units of the product they would like to buy.
// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
// However, if your store does have enough of the product, you should fulfill the customer's order.

// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.

displayProducts();
