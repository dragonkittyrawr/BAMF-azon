CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(255) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price DECIMAL(7,2) NOT NULL DEFAULT 1.00,
stock_quantity INT NOT NULL DEFAULT 0,
CONSTRAINT PK_bamazon PRIMARY KEY (item_id,department_name)
);


ALTER TABLE products AUTO_INCREMENT=10000;