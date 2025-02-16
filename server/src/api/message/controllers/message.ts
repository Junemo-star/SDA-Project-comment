import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::message.message', ({ strapi }) => ({
    async create(ctx) {
        const response = await super.create(ctx);

        // ส่ง event ไปยัง client ทุกคนผ่าน WebSocket
        (strapi as any).io.emit('newMessage', response);

        return response;
    },

    async find(ctx) {
        const messages = await super.find(ctx);
        return messages;
    }
}));
