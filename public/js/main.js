const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const roomusers = document.getElementById('users')

// Get Username and Room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room })

// Get the room users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room)
    outputUsers(users)
})

socket.on('message', message => {
    outputMessage(message)

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight
})

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const msg = e.target.elements.msg.value

    //Emit the messaged typed to the server
    socket.emit('chatMessage', msg)

    //Clear the input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

// Displayed message received
function outputMessage(message) {
    const div = document.createElement('div')

    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room
}

// Add or Remove Users
function outputUsers(users) {
    roomusers.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}