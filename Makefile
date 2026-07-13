.PHONY: help install dev dev-backend dev-frontend build test clean docker-up docker-down docker-build

# Default target
help: ## Show this help message
	@echo "TripForge - FARM Stack Trip Planning Application"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies (backend + frontend)
	cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt
	cd frontend && npm install

dev: ## Run both backend and frontend in development mode
	@echo "Starting TripForge in development mode..."
	@echo "Backend: http://localhost:8000"
	@echo "Frontend: http://localhost:5173"
	@echo "API Docs: http://localhost:8000/docs"

dev-backend: ## Run backend development server
	cd backend && source venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend: ## Run frontend development server
	cd frontend && npm run dev

build: ## Build frontend for production
 cd frontend && npm run build

test: ## Run all tests
	cd backend && source venv/bin/activate && python -m pytest tests/ -v

test-backend: ## Run backend tests only
	cd backend && source venv/bin/activate && python -m pytest tests/ -v --tb=short

lint: ## Run linters
	cd frontend && npx eslint src/ --ext .ts,.tsx || true

docker-build: ## Build Docker images
	docker-compose build

docker-up: ## Start all services with Docker
	docker-compose up -d
	@echo "TripForge is running!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend API: http://localhost:8000"
	@echo "API Docs: http://localhost:8000/docs"
	@echo "MongoDB: localhost:27017"

docker-down: ## Stop all Docker services
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

clean: ## Clean build artifacts and caches
	rm -rf frontend/dist
	rm -rf frontend/node_modules
	rm -rf backend/venv
	rm -rf backend/__pycache__
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
