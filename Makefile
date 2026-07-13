.PHONY: help install dev dev-backend dev-frontend build test clean docker-up docker-down docker-build

help: ## Show this help message
	@echo "TripForge - FARM Stack Trip Planning Application"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt
	cd frontend && npm install

dev: ## Run both backend and frontend
	@echo "Starting TripForge in development mode..."
	@echo "Backend: http://localhost:8000"
	@echo "Frontend: http://localhost:5173"
	@make -j2 dev-backend dev-frontend

dev-backend: ## Run backend server
	cd backend && source venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend: ## Run frontend dev server
	cd frontend && npm run dev

build: ## Build frontend for production
	cd frontend && npm run build

test: ## Run all tests
	cd backend && source venv/bin/activate && python -m pytest tests/ -v
	cd frontend && npx tsc --noEmit

test-backend: ## Run backend tests
	cd backend && source venv/bin/activate && python -m pytest tests/ -v --tb=short

test-frontend: ## Run frontend type checking
	cd frontend && npx tsc --noEmit

docker-build: ## Build Docker images
	docker-compose build

docker-up: ## Start all services with Docker
	docker-compose up -d
	@echo "TripForge is running!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend API: http://localhost:8000"

docker-down: ## Stop all Docker services
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

clean: ## Clean build artifacts
	rm -rf frontend/dist
	rm -rf frontend/node_modules
	rm -rf backend/venv
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
