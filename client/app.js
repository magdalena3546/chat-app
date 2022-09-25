const loginForm = document.getElementById('welcome-form');
const messagesSection = document.querySelector('#messages-section');
const messagesList = document.querySelector('#messages-list');
const addMessageForm = document.querySelector('#add-messages-form');
const userNameInput = document.querySelector('#username');
const messageContentInput = document.querySelector('#message-content');

const socket = io();

let userName = '';

socket.on('message', ({
    author,
    content
}) => addMessage(author, content));

socket.on('user', (user) => addMessage('Chat Bot', user.name + ' has joined the conversation!'));
socket.on('userRemove', (userRemove) => addMessage('Chat Bot', userRemove.name + ' has left the conversation!'));

function login(e) {
    e.preventDefault();
    if (userNameInput.value === '') {
        alert('The field is empty, please enter your user name!')
    } else {
        userName = userNameInput.value;
        socket.emit('user', {
            name: userName,
            id: socket.id
        });
        loginForm.classList.remove('show');
        messagesSection.classList.add('show');
    }
};

function sendMessage(e) {
    e.preventDefault();
    if (messageContentInput.value === '') {
        alert('The field is empty, please write your message!');
    } else {
        addMessage(userName, messageContentInput.value);
        socket.emit('message', {
            author: userName,
            content: messageContentInput.value
        });
        messageContentInput.value = '';
    }
};

function addMessage(author, content) {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if (author === userName) {
        message.classList.add('message--self')
    };
    if (author === 'Chat Bot') {
        message.classList.add('message--chatBot')
    };
    message.innerHTML = `
    <h3 class="message__author">${author === userName ? 'You' : author}</h3>
    <div class="message__content">${content}</div>`;
    messagesList.appendChild(message);
};

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);