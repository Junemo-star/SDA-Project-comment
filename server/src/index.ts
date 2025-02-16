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

    io.on('connection', (socket) => {
      console.log('🔌 New client connected:', socket.id);

      // บันทึก io ไว้ใน strapi เพื่อให้ใช้ได้ในที่อื่น
      (strapi as any).io = io;

      socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
      });
    });
  },
};
