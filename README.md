# NestJS Authentication Graphql

![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

Enterprise-grade authentication service featuring:
- Basic email/password authentication
- Biometric authentication via simplewebauthn
- JWT token management
- PostgreSQL persistence with Prisma ORM
- Dockerized deployment

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Support](#support)

## Prerequisites

Ensure you have these installed:
- Node.js v18+
- Docker v24+ with Docker Compose
- PostgreSQL client (optional)
- GraphQL client (Insomnia/Postman/GraphQL Playground recommended)

## Quick Start

```bash
# 1. Clone repository
git clone https://github.com/ogunwolejo/bio-auth.git
cd bio-auth

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your values

# 4. Build application via docker
docker-compose up --build

# 5. Start database
docker-compose up -d
```

Application will be available at:

GraphQL Playground: http://localhost:3000/graphql

## Testing GraphQL Endpoints

### Authentication Flow

1. __User Registration Using passkey__

```bash
    mutation {
      registerUser(input: {
        email: "ogunwole888@gmail.com",
        password: "Ifeoluwapo6448#",
        passkeyId: "joshua1234"
      }) 
    }
```

2. __User Registration via password__

```bash
    mutation {
      registerUser(input: {
        email: "ogunwole888@gmail.com",
        password: "Ifeoluwapo6448#",
      }) 
    }
```


3.  __Basic Login__

```bash
    mutation {
      login(
        loginInput: {
          email: "joshuaogunwolejo888@gmail.com"
          pass: "Ifeoluwapo6448#"
        }
      ) {
        email
        id
        AccessToken
        name
        RefreshToken
        updatedAt
      }
    }
```

4. __Biometric PassKey Login__

```bash
    mutation{
      loginWithPasskey(input: {email:"ogunwole888@gmail.com", passKey: "vvvbmnmn"}) {
        success,  
        message,
        token,
      }
    }
```
Biometric Authentication Flow
* Client generates biometric key pair using simplewebauthn/server SDK
* Store public key in your user database
* On authentication:
* Client creates biometric challenge
* Server verifies signature using simplewebauthn/server package
* Returns JWT tokens on success

## Docker Setup

### Build docker container
```bash
    # ensure you have the dev.Dockerfile and docker-compose.yml
    $ docker-compose up --build
```

### Stop container
```bash
  $ docker-compose down
```

## Testing
```bash
    npm run test
```


## Troubleshooting
Common Issues
Database Connection Refused

Verify Docker container is running

Check DATABASE_URL in .env

## JWT Errors

Ensure consistent SECRET across environments

Validate token expiration configuration

Biometric Authentication Failures

Check network connectivity to simplewebauthn/server endpoints


