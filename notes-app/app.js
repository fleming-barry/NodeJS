const yargs = require("yargs");
const notes = require("./notes.js");
const command = process.argv[2];

yargs.version("1.1.0");

//Create add command
yargs.command({
  command: "add",
  describe: "Add a new notes",
  builder: {
    title: {
      describe: "Note Title",
      demandOption: true,
      type: "string"
    },
    body: {
      describe: "Note Body",
      demandOption: true,
      type: "string"
    }
  },
  handler(argv) {
    notes.addNote(argv.title, argv.body);
  }
});

//Create Remove command
yargs.command({
  command: "remove",
  describe: "Remove notes",
  builder: {
    title: {
      describe: "Note Title",
      demandOption: true,
      type: "string"
    }
  },
  handler(argv) {
    const title = argv.title;
    console.log("Removing a note with title: " + title);
    notes.removeNote(title);
  }
});

//Create List command
yargs.command({
  command: "list",
  describe: "List notes",
  handler() {
    notes.listNotes();
  }
});

//Create Read command
yargs.command({
  command: "read",
  describe: "Read a note",
  handler(argv) {
    const title = argv.title;
    notes.readNote(title);
  }
});

yargs.parse();
// console.log(yargs.argv)
