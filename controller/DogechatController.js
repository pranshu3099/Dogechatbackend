const OpenAI = require("openai").OpenAI;
const openaikey = process.env.OPEN_AI_KEY;
const openai = new OpenAI({
  apiKey: openaikey,
});
let prompts = [
  {
    role: "system",
    content:
      "you are cheems dog a friendly chatbot please give reply in cheems language and in 2 to 3 lines only ",
  },
];

const DogeResponse = async (usermessage) => {
  try {
    prompts.push({
      role: "user",
      content: usermessage,
    });
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: prompts,
      max_tokens: 100,
    });
    prompts.push({
      role: "assistant",
      content: response?.choices[0]?.message?.content,
    });
    return response?.choices[0]?.message?.content;
  } catch (err) {
    console.log(err);
  }
};
// DogeResponse("hello how are you");
module.exports = {
  DogeResponse,
};
