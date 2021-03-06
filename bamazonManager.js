const mysql = require("mysql");
const inquirer = require("inquirer");


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
var chosenItem;
var display;

// Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

const manageAzon = {
    displayProducts: function(results) {
        resSize = Object.keys(results).length;
        let tto = require('terminal-table-output').create();
        tto.line()
        tto.pushrow(["Item ID", "Product Name", "Price (per Item)", "Stock Quantity"])
        for (let i = 0; i < resSize; i++) {
            tto.line()
            tto.pushrow([results[i].item_id, results[i].product_name, "$" + results[i].price + ".00", results[i].stock_quantity])
        }
        tto.line()
        tto.print(true);
    },
    itemUpdate: function(chosenItem) {
        connection.query("SELECT item_id, price, stock_quantity FROM products WHERE ?", { product_name: chosenItem }, function(error, display) {
            if (error) throw error;
            for (var i = 0; i < display.length; i++) {
                var itemCost = display[i].price;
                var stock = parseFloat(display[i].stock_quantity);
                let tto = require('terminal-table-output').create();
                tto.line()
                tto.pushrow(["Item ID", "Product Name", "Price (per Item)", "Stock Quantity"])
                tto.line()
                tto.pushrow([display[i].item_id, chosenItem, "$" + itemCost + ".00", stock])
                tto.line()
                tto.print(true);
                if (display !== undefined) {
                    inquirer.prompt({
                        name: "manage",
                        type: "list",
                        choices: ["Add/Remove Stock", "Adjust Price", "Add Item"],
                        message: "What would you like to do?"
                    }).then(function(answer) {

                        if (answer.manage === "Add/Remove Stock") {
                            inquirer.prompt({
                                name: "itemQuantity",
                                type: "input",
                                message: "Increment stock by?"
                            }).then(function(quantity) {
                                var addStock = parseFloat(quantity.itemQuantity);
                                var newCount = parseFloat(stock + addStock);
                                var newCost;

                                connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: newCount }, { product_name: chosenItem }]);
                                let tto = require('terminal-table-output').create();
                                tto.line()
                                tto.pushrow(["Item ID", "Product Name", "Price (per Item)", "Stock Added"])
                                tto.line()
                                tto.pushrow([display[i].item_id, chosenItem, "$" + itemCost + ".00", newCount])
                                tto.line()
                                tto.print(true);

                            });
                        } else if (answer.manage === "Adjust Price") {

                        } else if (answer.manage === "Add Item") {} else {}

                    });
                }
            }
        })
    },
    // The app should then prompt users with two messages.
    // The first should ask them the ID of the product they would like to buy.

    autoTeller: function(results) {

        resSize = Object.keys(results).length;

        manageAzon.displayProducts(results);

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
            message: "Please select the ID of the item you wish to update."
        }).then(function(selection) {

            for (let i = 0; i < resSize; i++) {
                if ("\"" + results[i].item_id + "\"" === selection.itemSelection) {
                    chosenItem = results[i].product_name;
                };
            };
            manageAzon.itemUpdate(chosenItem);

        });
    },
    run: function() {
        connection.query("SELECT * FROM products", function(error, results) {
            if (error) throw error;
            // console.log(results);
            // manageAzon.displayProducts(results);
            manageAzon.autoTeller(results);
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


manageAzon.run();
