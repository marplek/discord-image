# 使用官方 Node.js 為基礎鏡像
FROM node:latest

# 設定工作目錄
WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝項目依賴
RUN npm install

# 複製項目文件到工作目錄
COPY . .

# 暴露3000端口
EXPOSE 3050

# 啟動應用
CMD [ "node", "app.js" ]
