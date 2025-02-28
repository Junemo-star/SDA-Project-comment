import type { Core } from '@strapi/strapi';
import { Server as SocketIOServer } from 'socket.io';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const io = new SocketIOServer(strapi.server.httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    let connectionCount = 0;

    io.on('connection', (socket) => {
      console.log('🔌 New client connected:', socket.id);
      (strapi as any).io = io;

      connectionCount++;
      io.emit('updateConnectionCount', connectionCount);
      console.log('A user connected. Total connections:', connectionCount);

      socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);

        connectionCount--;
        io.emit('updateConnectionCount', connectionCount);
        console.log('A user disconnected. Total connections:', connectionCount);
      });
    });
  },
};
