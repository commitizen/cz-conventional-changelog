"format cjs";

var format = require('./format');
var prompt = require('./prompt');

// This can be any kind of SystemJS compatible module.
// We use Commonjs here, but ES6 or AMD would do just
// fine.
module.exports = {

  // When a user runs `git cz`, prompter will
  // be executed. We pass you cz, which currently
  // is just an instance of inquirer.js. Using
  // this you can ask questions and get answers.
  //
  // The commit callback should be executed when
  // you're ready to send back a commit template
  // to git.
  //
  // By default, we'll de-indent your commit
  // template and will keep empty lines.
  prompter: function(cz, commit) {
    console.log('\n' + format.help + '\n');
    prompt(cz, function (answers) {
      var commitParts = format.format(answers);
      commit(commitParts.head + '\n\n' + commitParts.body + '\n\n' + commitParts.footer);
    });
  }
};
