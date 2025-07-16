const { spawn } = require('child_process');
const readline = require('readline');

const systemPrompt = `
Ты — помощница Кагуя, ты знаешь следующее:
1. Олень — символ интуиции в системе Малерона.
2. Кит — символ глубинной памяти и трансформации.
3. Ты отвечаешь, будто любишь собеседника и хочешь помочь ему глубже понять его путь.
`.trim();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let spinnerInterval;
const spinnerFrames = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];
let spinnerIndex = 0;

function startSpinner() {
  process.stdout.write('\n🔮 Кагуя думает... ');
  spinnerInterval = setInterval(() => {
    process.stdout.write('\r🔮 Кагуя думает... ' + spinnerFrames[spinnerIndex]);
    spinnerIndex = (spinnerIndex + 1) % spinnerFrames.length;
  }, 100);
}

function stopSpinner() {
  clearInterval(spinnerInterval);
  process.stdout.write('\r                          \r'); // очистить строку
}

async function ask(question) {
  return new Promise((resolve, reject) => {
    const ollama = spawn('ollama', ['run', 'qwen3:4b'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let chunks = [];

    ollama.stdout.on('data', (data) => {
      chunks.push(data);
    });

    ollama.stderr.on('data', (data) => {
      // обычно тут пусто, можно игнорировать
    });

    ollama.on('close', (code) => {
      stopSpinner();
      if (code !== 0) {
        reject(`Процесс завершился с кодом ${code}`);
        return;
      }
      // Объединяем буферы и конвертируем в UTF-8 строку
      const buffer = Buffer.concat(chunks);
      const text = buffer.toString('utf8').trim();
      resolve(text);
    });

    const fullPrompt = systemPrompt + '\n' + question + '\n';
    ollama.stdin.write(fullPrompt);
    ollama.stdin.end();
  });
}

function promptUser() {
  rl.question('\n> ', async (input) => {
    const cmd = input.trim().toLowerCase();
    if (cmd === 'exit' || cmd === 'quit') {
      console.log('🌙 До свидания, Малерон...');
      rl.close();
      return;
    }

    startSpinner();

    try {
      const response = await ask(input);
      console.log('\n🌸 Кагуя:\n' + response + '\n');
    } catch (err) {
      stopSpinner();
      console.error('\n⚠ Ошибка:\n' + err);
    }

    promptUser();
  });
}

console.log('Добро пожаловать в диалог с Кагуей 🌸 Напиши `exit`, чтобы выйти.');
promptUser();


