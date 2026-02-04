const sendBtn = document.getElementById("send-btn");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chatBox");
const voiceBtn = document.getElementById("voiceBtn");

function appendMessage(text, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", `${sender}-message`);
    chatBox.appendChild(msgDiv);
    
    if (sender === "bot") {
        let i = 0;
        function type() {
            if (i < text.length) {
                msgDiv.textContent += text.charAt(i);
                i++;
                setTimeout(type, 10);
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        }
        type();
    } else {
        msgDiv.textContent = text;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function handleChat() {
    const message = input.value.trim();
    if (!message) return;

    appendMessage(message, "user");
    input.value = "";

    try {
        const res = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });
        const data = await res.json();
        appendMessage(data.response, "bot");
    } catch (err) {
        appendMessage("Error: Could not connect to AI.", "bot");
    }
}

sendBtn.addEventListener("click", handleChat);
input.addEventListener("keypress", (e) => { if (e.key === "Enter") handleChat(); });

// Voice recognition basic
voiceBtn.addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.start();
    voiceBtn.style.color = "red";
    recognition.onresult = (event) => {
        input.value = event.results[0][0].transcript;
        voiceBtn.style.color = "#00d2ff";
        handleChat();
    };
});