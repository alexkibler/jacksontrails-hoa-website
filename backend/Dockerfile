# Stage 1: Build the application
# Use the build platform (e.g., linux/amd64) to run the compiler, which is much faster than QEMU emulation
FROM --platform=$BUILDPLATFORM golang:1.22-alpine3.19 AS builder

ARG TARGETOS
ARG TARGETARCH

WORKDIR /app

# Copy go mod and sum files
COPY go.mod ./
# Note: go.sum might not exist yet if we haven't run tidy, so we'll skip copying it explicitly
# and run tidy inside the container.
# COPY go.sum ./

# Copy the source code
COPY . .

# Download dependencies
RUN go mod tidy

# Build the application
# CGO_ENABLED=0 creates a statically linked binary
# We use the TARGETOS and TARGETARCH arguments to cross-compile for the target platform
RUN CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH go build -o pocketbase main.go

# Stage 2: Run the application
FROM alpine:3.19

# Install necessary packages (ca-certificates for HTTPS)
RUN apk add --no-cache ca-certificates unzip wget bash

WORKDIR /pb

# Copy the compiled binary from the builder stage
COPY --from=builder /app/pocketbase /usr/local/bin/pocketbase

# Ensure the binary is executable
RUN chmod +x /usr/local/bin/pocketbase

# Create directories for data and public files (if needed)
RUN mkdir -p /pb/pb_data /pb/pb_public

# Expose the port
EXPOSE 8090

# Run the application
# We don't need to specify migrationsDir because migrations are compiled in.
CMD ["/usr/local/bin/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data"]