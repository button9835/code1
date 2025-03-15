const socket = new WebSocket('ws://' + location.host);

socket.onmessage = (event) => {
    document.getElementById('displayText').textContent = event.data;
};

document.getElementById('sendButton').addEventListener('click', () => {
    const text = document.getElementById('inputText').value;
    if (text.length > 100) {
        alert("100자를 초과할 수 없습니다.");
        return;
    }
    socket.send(text);
});
