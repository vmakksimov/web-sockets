let readyPlayerCoujnt = 0;

function listen (io) {
    const pongSpace = io.of('/pong')
    let room;
    pongSpace.on('connection', (socket) => {
        
    console.log('a user connected', socket.id);

    socket.on('ready', () => {
        room = 'room' + Math.floor(readyPlayerCoujnt / 2)
        socket.join(room)
        console.log('Player ready', socket.id)
        readyPlayerCoujnt++
        if (readyPlayerCoujnt === 2){
            pongSpace.in(room).emit('startGame', socket.id)
        }
    })

    socket.on('paddleMove', (paddleData) => {
        socket.to(room).emit('paddleMove', paddleData)
    
    })

    socket.on('ballMove', (ballData) => {
        socket.to(room).emit('ballMove', ballData)
    })

    socket.on('disconnect', (reason) => {
        console.log(`Client ${socket.id} disconnected`)
        socket.leave(room);
    })
})
}

module.exports = {
    listen
}