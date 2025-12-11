# Stage 1: Build the application
FROM golang:1.22-alpine AS builder

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
RUN CGO_ENABLED=0 GOOS=linux go build -o pocketbase main.go

# Stage 2: Run the application
FROM alpine:latest

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