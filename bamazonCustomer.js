const mysql = require("mysql");
const inquirer = require("inquirer");
const tto = require('terminal-table-output').create();

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function(error) {
    if (error) throw error;
});

var resSize;

// Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

const bamfAzon = {
    displayProducts: function(results) {
        resSize = Object.keys(results).length;
        // var table = function() {
        tto.line()
        tto.pushrow(["Item ID", "Product Name", "Price (per Item)", "Stock Quantity"])
        for (let i = 0; i < resSize; i++) {
            tto.line()
            // console.log(results);
            // console.log(results.item_id);
            tto.pushrow([results[i].item_id, results[i].product_name, parseFloat(results[i].price), results[i].stock_quantity])
        }
        tto.line()
        tto.print(true);

        // console.log("==========================");
        // console.log(productArray);
        // console.log("==========================");
        // return productArray;
        // }

    },
    itemDisplay: function(results) {
        tto.line()
        tto.pushrow(["Item ID", "Product Name", "Price (per Item)", "Stock Quantity"])
        tto.line()
        tto.pushrow([chosenItem.item_id, chosenItem.product_name, parseFloat(chosenItem.price), chosenItem.stock_quantity])
        tto.line()
        tto.print(true);


        table();
        autoTeller();
    },

    // The app should then prompt users with two messages.
    // The first should ask them the ID of the product they would like to buy.

    autoTeller: function(results) {

        resSize = Object.keys(results).length;

        bamfAzon.displayProducts(results);

        inquirer.prompt({
            name: "itemSelection",
            type: "list",
            choices: function() {
                var productArray = [];
                for (let i = 0; i < resSize; i++) {
                    productArray.push("\"" + results[i].item_id + "\"");
                } // end for loop
                return productArray;
            },
            message: "Please select the ID of the item you wish to purchase."
        }).then(function(selection) {
            var chosenItem;
            for (let i = 0; i < resSize; i++) {
                if ("\"" + results[i].item_id + "\"" === selection.itemSelection) {
                    chosenItem = results[i].product_name;
                    if (chosenItem.stock_quantity > 1) {

                        bamfAzon.itemDisplay(results);

                        inquirer.prompt({
                            name: "itemQuantity",
                            type: "input",
                            message: "How many would you like to purchase?"
                        }).then(function(quantity) {
                            var chosenQuantity;
                            for (let i = 0; i < 2; i++) {
                                chosenQuantity = quantity.itemQuantity;
                                results[i].stock_quantity -= chosenQuantity;
                            }; // end of chosenQuantity loop.
                        }); // end of itemQuantity then.
                    }; // end of in stock check if.
                }; // end of item selection if.
            }; // end of results length for loop.
        });
    },
    run: function() {
        connection.query("SELECT * FROM products", function(error, results) {
            if (error) throw error;
            // console.log(results);
            // bamfAzon.displayProducts(results);
            bamfAzon.autoTeller(results);
            return results;
        });


    }
};

// The second message should ask how many units of the product they would like to buy.
// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
// However, if your store does have enough of the product, you should fulfill the customer's order.

// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.


bamfAzon.run();
