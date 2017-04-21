var mysql = require("mysql");
// var prompt = require("prompt");
var inquirer = require("inquirer");
var Table = require("cli-table");
var colors = require("colors");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "root",
	database: "bamazon"
}); 

connection.connect(function(err){
	if (err) throw err;
});

var table;

var start = function(){

	connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(err, res){

var table = new Table({
	chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },

    head: ["ID", "Name", "Department", "Price", "Stock"]
})

		for (var i = 0; i < res.length; i++){


			console.log("in loop: " + i);
		
			table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
		}

		console.log(table.toString());

		inquirer.prompt([
			{
				message: "Enter the ID of the item you wish to purchase",
				type: "input",
				name: "id",
				
			},

			{
				message: "How many items would you like to buy?",
				type: "input",
				name: "amount",
				

			}]).then(function(result){

				connection.query("SELECT item_id, price, stock_quantity FROM products WHERE ?", {item_id: result.id}, function(err, res){

						
					
						if(result.amount <= res[0].stock_quantity){
							console.log("can do!");

							connection.query("UPDATE inventory SET ? WHERE ?", [{stock_quantity: res[0].stock_quantity - result.amount},{item_id: result.id}], function(err, data){
								// if(err) throw err;
								console.log("You bought something! Your total is: $" + res[0].price * result.amount);

								

								
							})
							
						}

						 else{
							console.log("Not Enough in stock. Try again!");
							console.log("else: " + i);
							// start();
						}
						console.log("before start: " + i);
					start();
				});

				
				// console.log("You've chosen to purchase item number " + result.id + ".");
				// console.log("You're buying " + result.amount + " items.");
				});

	

	});



	}

		
start();
