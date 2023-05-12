import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? 'http://localhost:9000' : 'http://localhost:9000';

export const socket: Socket = io(URL,
     {transports: ['websocket'],
        autoConnect: false,
         
});