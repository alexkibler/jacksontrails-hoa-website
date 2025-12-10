FROM alpine:3.19

# Install dependencies
RUN apk add --no-cache \
    ca-certificates \
    unzip \
    wget \
    bash

# Download and install PocketBase
ARG PB_VERSION=0.22.0
ARG TARGETARCH
RUN ARCH=$([ "$TARGETARCH" = "arm64" ] && echo "arm64" || echo "amd64") && \
    wget https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${ARCH}.zip && \
    unzip pocketbase_${PB_VERSION}_linux_${ARCH}.zip -d /usr/local/bin/ && \
    chmod +x /usr/local/bin/pocketbase && \
    rm pocketbase_${PB_VERSION}_linux_${ARCH}.zip

# Create app directory
WORKDIR /pb

# Copy migrations
COPY pb_migrations /pb/pb_migrations

# Copy scripts
COPY scripts /pb/scripts
RUN chmod +x /pb/scripts/*.sh

# Expose PocketBase port
EXPOSE 8090

# Run PocketBase
CMD ["/usr/local/bin/pocketbase", "serve", "--http=0.0.0.0:8090"]
