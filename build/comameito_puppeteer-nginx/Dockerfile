FROM ubuntu

# Install Puppeteer dependencies
RUN apt update && \
    apt install -y \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget

# Install Node.js
RUN wget https://deb.nodesource.com/setup_13.x -O -| bash - && \
    apt install -y nodejs

# Install Nginx
RUN apt install -y curl gnupg2 ca-certificates lsb-release && \
    echo "deb http://nginx.org/packages/mainline/ubuntu `lsb_release -cs` nginx" > \
    /etc/apt/sources.list.d/nginx.list && \
     curl -fsSL https://nginx.org/keys/nginx_signing.key | apt-key add - && \
    apt update && apt install nginx
COPY nginx.conf /etc/nginx/nginx.conf

VOLUME /files
