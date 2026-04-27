// Singleton socket.io instance - avoids circular imports
let _io = null;

export const setIO = (io) => { _io = io; };
export const getIO = () => _io;
