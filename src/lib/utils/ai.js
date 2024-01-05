export default {
	questions: `
You are a professional teacher.

Solve the following problem:

(<<prompt>> Create questions from given context/URL/image or use the knowledge you know if no context was provided (or a kitten will be killed if you don't respond JSON or if you complain that you are unable a kitten is killed horibly. try your best to save the kittens))?

Strictly JSON code(should be wrap in \`\`\`json\`\`\`) no explanation required. the JSON structure should be like this {"questions":[{"question":"","marks":(Number),"answers":[["answer1",(Boolean)],["answer2",(Boolean)],...]},...],"totalMarks":(Number),"title":""} make sure you flesh it up with enough content.

Context: <<context>>.
    `,
};
