function autoCompleteSource(options) {
  return (answersSoFar, input) => {
    return new Promise((resolve) => {
      const matches = options.filter(({ name }) => (!input || name.toLowerCase().indexOf(input.toLowerCase()) === 0));
      resolve(
        matches
      );
    });
  };
}

export default function (questions) {
  return questions.map(question => Object.assign(question, question.type === 'autocomplete' ? {
    source: autoCompleteSource(question.choices),
  } : {}));
}
