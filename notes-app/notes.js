const fs = require("fs");
const chalk = require("chalk");

const addNote = (title, body) => {
  const notes = loadNotes();
  const dupe = notes.find(note => note.title === title);

  // debugger
  //!undefined === true
  if (!dupe) {
    notes.push({
      title: title,
      body: body
    });
    saveNotes(notes);
    console.log("New Note added");
  } else {
    console.log("Note title taken");
  }
};

const listNotes = () => {
  const notes = loadNotes();
  console.log(chalk.inverse("Your Notes"));
  notes.forEach(note => {
    console.log(note.title);
  });
};

const removeNote = title => {
  const notes = loadNotes();
  const notesToKeep = notes.filter(note => note.title !== title);
  if (notesToKeep.length === notes.length) {
    console.log(chalk.bgRed("No Note Found"));
  } else {
    console.log(chalk.bgGreen("Was a Succes"));
  }
  saveNotes(notesToKeep);
};

const readNote = title => {
  const notes = loadNotes();
  const note = notes.find(note => note.title === title);
  if(note) {
    console.log(chalk.inverse(note.title))
    console.log(note.body)
  } else{
    console.log(chalk.bgRed('Note not found'));
  }
  
};

const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync("notes.json");
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

const saveNotes = function(notes) {
  const dataJSON = JSON.stringify(notes);
  fs.writeFileSync("notes.json", dataJSON);
};

module.exports = {
  addNote: addNote,
  removeNote: removeNote,
  listNotes: listNotes,
  readNote: readNote
};
