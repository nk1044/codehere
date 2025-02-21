FROM ubuntu:latest

WORKDIR /root

# Install dependencies
RUN apt-get update && apt-get upgrade -y && apt-get install -y \
    wget \
    git \
    unzip \
    curl \
    nano \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Coder
RUN curl -L https://coder.com/install.sh -o install.sh \
    && chmod +x install.sh \
    && ./install.sh \
    && rm install.sh

# Expose ports
EXPOSE 8080
EXPOSE 5432
EXPOSE 3001
EXPOSE 3000

# Define persistent volumes
VOLUME ["/root/.local/share/code-server", "/root/.config/code-server"]

# Run a process (Example: Start a simple web server)
CMD ["tail", "-f", "/dev/null"]
