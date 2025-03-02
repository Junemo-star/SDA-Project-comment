# ใช้ Node.js official image
FROM node:18

# ตั้ง working directory
WORKDIR /app

# คัดลอก package.json และ yarn.lock (ถ้ามี) เพื่อติดตั้ง dependencies
COPY package.json yarn.lock* ./

# ติดตั้ง dependencies
RUN yarn install --production

# คัดลอกโค้ดทั้งหมด
COPY . .

# Build Strapi
RUN yarn build

# รัน Strapi ในโหมด production
CMD ["yarn", "start"]