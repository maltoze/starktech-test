## 开始使用

### 1. 环境设置

首先，复制环境变量示例文件并设置您的 FinMind API Token：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，加入您的 FinMind API Token：

```bash
FINMIND_API_TOKEN=your_actual_api_token_here
```

**如何获取 FinMind API Token：**
1. 前往 [FinMind 官网](https://finmindtrade.com/)
2. 注册账号并登录
3. 在 API 设置页面获取您的 Token

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 来查看应用程序。
