# Quiz (quiz)
An app where users can create their own flashcard decks, take quizzes based on the cards, and track their progress.

Userflow:
- The user can select to either play the quiz game or to add new quiz cards to the game
- If the user adds quiz cards, they choose a new quiz question with one or more wrong answers and one correct answer
- The quiz cards information is stored in Database
- If the user selects to play the quiz, they are asked 10 quiz questions in a sequence.
- The sequence is randomised at the start of the quiz
- The user can select one or more of the shown answers
- If the user answers correctly, they are given a point
- The progress is shown during the quiz 
- Once all 10 questions are answered, a result page is shown with the score and the option to play again.


## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### If quasar command not found found
Please run
```
yarn global add @quasar/cli
yarn quasar dev
```

### Lint the files
```bash
yarn lint
# or
npm run lint
```



### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
