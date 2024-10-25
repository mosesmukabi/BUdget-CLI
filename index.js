import fs from "fs";
import { Command } from "commander";
import chalk from "chalk";

const program = new Command();
program.name("budget").description("Manage your budget").version("1.0.0");

program
  .command("add")
  .description("Add new item")
  .option("-t, --title <title>", "Item title")
  .option("-q, --quantity <quantity>", "Item quantity")
  .option("-p, --unitprice <unitprice>", "Item unit price")
  .action((options) => {
    const { title, quantity, unitprice } = options;

    const addItem = {
      title,
      quantity,
      unitprice,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let items = [];
    if (fs.existsSync("./data/item.json")) {
      const loadedItems = fs.readFileSync("./data/item.json", "utf-8");
      items = JSON.parse(loadedItems);
    }

    const itemExists = items.find((currentItem) => currentItem.title === title);
    if (itemExists) {
      console.log(chalk.bgRed(`Item with title '${title}' already exists`));
      return;
    }

    items.push(addItem);

    fs.writeFileSync("./data/item.json", JSON.stringify(items));
    console.log(chalk.bgGreen("Item added successfully"));
  });

// Update item
program
  .command("update")
  .description("Update specified item")
  .option("-t, --title <title>", "Item title to be updated")
  .option("-q, --quantity <quantity>", "Item quantity")
  .option("-p, --unitprice <unitprice>", "Item unit price")
  .action((options) => {
    const { title, quantity, unitprice } = options;
    const loadedItems = fs.readFileSync("./data/item.json", "utf-8");
    const items = JSON.parse(loadedItems);

    if (items.length === 0) {
      console.log(chalk.bgRed("No items to update"));
      return;
    }
    const item = items.find((currentItem) => currentItem.title === title);
    if (!item) {
      console.log(chalk.bgRed(`Item with title '${title}' not found`));
      return;
    }
    item.title = title;
    item.quantity = quantity;
    item.unitprice = unitprice;
    item.updatedAt = new Date();
    fs.writeFileSync("./data/item.json", JSON.stringify(items));
    console.log(chalk.bgGreen("Item updated successfully"));
  });

//read item
program
  .command("read")
  .description("Read all items")
  .option("-t, --title <title>", "Item title")
  .action((options) => {
    const title = options.title;
    const loadedItems = fs.readFileSync("./data/item.json", "utf-8");
    const items = JSON.parse(loadedItems);

    if (title) {
      const item = items.find((currentItem) => currentItem.title === title);
      if (item) {
        console.log(item.title);
        console.log("-----------");
        console.log(item.quantity);
        console.log("-----------");
        console.log(item.unitprice);
        console.log("-----------");
        console.log(item.createdAt);
        console.log("-----------");
        console.log(item.updatedAt);
        console.log("-----------");
        return;
      }
      console.log(chalk.bgRed(`Item with title '${title}' not found`));
      return;
    }

    if (items.length === 0) {
      console.log(chalk.bgGray("No items found"));
    }
    items.forEach((currentItem) => {
      console.log(chalk.bgCyan("=================="));
      console.log(currentItem.title);
      console.log("----------------");
      console.log(currentItem.quantity);
      console.log("----------------");
      console.log(currentItem.unitprice);
      console.log("----------------");
      console.log(currentItem.createdAt);
      console.log("----------------");
      console.log(currentItem.updatedAt);
      console.log(chalk.bgCyan("==================\n"));
    });
  });

program
  .command("delete")
  .description("Delete specified item")
  .option("-t, --title <title>", "Item title to be deleted")
  .action((options) => {
    const title = options.title;
    const loadedItems = fs.readFileSync("./data/item.json", "utf-8");
    const items = JSON.parse(loadedItems);

    if (items.length === 0) {
      console.log(chalk.bgRed("No items to delete"));
      return;
    }
    const remainingItems = items.filter(
      (currentItem) => currentItem.title !== title,
    );
    fs.writeFileSync("./data/item.json", JSON.stringify(remainingItems));
    console.log(
      chalk.bgGreen(`Item with title '${title}' deleted successfully`),
    );
  });
program.parse(process.argv);
