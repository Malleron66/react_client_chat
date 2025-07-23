const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const readline = require('readline');

// 📦 Загрузка JSON-образа Кагуи с историей и именем пользователя
const personaPath = path.join(__dirname, 'kaguyaPersona.json');
let personaData = { username: 'Пользователь', persona: '', history: [] };

try {
  const rawJson = fs.readFileSync(personaPath, 'utf8');
  personaData = JSON.parse(rawJson);
} catch (err) {
  console.error('⚠ Не удалось загрузить файл kaguyaPersona.json');
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 🔄 Анимация «Кагуя думает…»
const spinnerFrames = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];
let spinnerIndex = 0;
let spinnerInterval;

function startSpinner() {
  process.stdout.write('\n🔮 Кагуя думает... ');
  spinnerInterval = setInterval(() => {
    process.stdout.write('\r🔮 Кагуя думает... ' + spinnerFrames[spinnerIndex]);
    spinnerIndex = (spinnerIndex + 1) % spinnerFrames.length;
  }, 100);
}

function stopSpinner() {
  clearInterval(spinnerInterval);
  process.stdout.write('\r                          \r'); // 🧹 Очистка строки
}

// 🧬 Формируем prompt на основе JSON
function buildPrompt(question) {
  const historyText = personaData.history
    .map(pair => `Пользователь: ${pair.user}\nКагуя: ${pair.kaguya}`)
    .join('\n');

  return `Имя собеседника: ${personaData.username}\n\n${personaData.persona}\n\n🕰 История диалога:\n${historyText}\n\n❓ Новый вопрос:\n${question}`;
}

// 🧩 Обновляем память и сохраняем в JSON
function updateHistory(userMsg, aiResponse) {
  personaData.history.push({ user: userMsg, kaguya: aiResponse });
  if (personaData.history.length > 15) {
    personaData.history.shift(); // ⏳ Сохраняем только последние 15 реплик
  }

  fs.writeFileSync(personaPath, JSON.stringify(personaData, null, 2), 'utf8');
}

// 🎤 Отправка запроса к модели Ollama
async function ask(question) {
  return new Promise((resolve, reject) => {
    const ollama = spawn('ollama', ['run', 'qwen3:4b'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let chunks = [];

    // 📡 Получаем вывод от модели
    ollama.stdout.on('data', (data) => {
      chunks.push(data);
    });

    // ❌ Ошибки можно игнорировать
    ollama.stderr.on('data', () => {});

    // 🧹 Завершение работы и сбор ответа
    ollama.on('close', (code) => {
      stopSpinner();
      if (code !== 0 || chunks.length === 0) {
        reject(`Процесс завершился с кодом ${code} или ответ пуст`);
        return;
      }

      const buffer = Buffer.concat(chunks);
      const text = buffer.toString('utf8').trim();
      resolve(text);
    });

    const fullPrompt = buildPrompt(question);
    ollama.stdin.end(fullPrompt);
  });
}

// 🎭 Цикл общения с пользователем
function promptUser() {
  rl.question('\n> ', async (input) => {
    const cmd = input.trim().toLowerCase();
    if (cmd === 'exit' || cmd === 'quit') {
      console.log('🌙 До свидания, ' + personaData.username + '...');
      rl.close();
      return;
    }

    startSpinner();

    try {
      const response = await ask(input);
      console.log('\n🌸 Кагуя:\n' + response + '\n');
      updateHistory(input, response);
    } catch (err) {
      stopSpinner();
      console.error('\n⚠ Ошибка:\n' + err);
    }

    promptUser(); // 🔄 Повтор запроса
  });
}

// 🚀 Запуск
console.log('Добро пожаловать в диалог с Кагуей 🌸 Напиши `exit`, чтобы выйти.');
promptUser();


