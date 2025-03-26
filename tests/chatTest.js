// tests/chatTest.js
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function prompt() {
  rl.question("You: ", async (message) => {
    if (message.trim().toLowerCase() === 'exit') {
      console.log("Goodbye!");
      rl.close();
      return;
    }
    try {
      // Mimic a front-end by sending an HTTP POST request to the /chat endpoint
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      console.log("Olive:", data.response);
    } catch (error) {
      console.error("Error:", error);
    }
    prompt();
  });
}

console.log("Welcome to the chat front-end test! Type 'exit' to quit.");
prompt();
