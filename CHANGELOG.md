# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-28

### Added
- ✅ Initial release of NestJS User Microservice
- ✅ Complete CRUD operations for user management
- ✅ TypeScript configuration with strict mode
- ✅ Prisma ORM integration with MySQL 8.0
- ✅ Docker Compose setup with MySQL + Adminer
- ✅ Secure password hashing with bcrypt
- ✅ Input validation with class-validator
- ✅ Global exception filters and logging interceptors
- ✅ Comprehensive test suite (62 tests, 67% coverage)
- ✅ Unit tests for business logic
- ✅ Integration tests for API endpoints
- ✅ E2E tests for complete workflows
- ✅ Database tests for Prisma operations
- ✅ DTO validation tests
- ✅ Soft delete and hard delete functionality
- ✅ Database seeding and migration scripts
- ✅ GitHub Actions CI/CD pipeline
- ✅ Professional documentation and contribution guidelines
- ✅ MIT license for open source usage

### Features
- RESTful API endpoints (`/users`)
- Email and username uniqueness validation
- Microservice architecture ready
- Production-ready configuration
- Professional testing standards
- Docker containerization
- Automated quality assurance

### Technical Stack
- **Framework**: NestJS 11.1.6
- **Language**: TypeScript 5.9.2
- **Database**: MySQL 8.0 with Prisma ORM 6.15.0
- **Testing**: Jest with 62 comprehensive tests
- **Security**: bcrypt password hashing
- **Validation**: class-validator & class-transformer
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
