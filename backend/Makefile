.PHONY: help format lint clean test coverage security check build deploy pre-commit docker watch

# Default target
.DEFAULT_GOAL := help

help: ## Show this help message
	@echo 'Usage:'
	@echo '  make [target]'
	@echo
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Core Development Workflow
format: ## Auto-format code using Black and isort
	poetry run black .
	poetry run isort .

lint: ## Static analysis (Flake8, Pylint, Mypy)
	poetry run flake8 .
	poetry run pylint backend/
	poetry run mypy backend/

test: ## Run tests with pytest and output coverage
	poetry run pytest -v --cov=backend --cov-report=term-missing

coverage: ## Generate HTML coverage report
	poetry run pytest --cov=backend --cov-report=html
	@echo "Coverage report: file://$(shell pwd)/htmlcov/index.html"

check: ## Run all checks (format → lint → test → security)
	@make format
	@make lint
	@make test
	@make security

# Security & Maintenance
security: ## Security scanning (Bandit + Safety)
	poetry run bandit -r backend/
	poetry run safety check --full-report

clean: ## Deep clean project artifacts
	find . -type d \( -name "__pycache__" -o -name ".pytest_cache" -o -name ".mypy_cache" -o -name "htmlcov" \) -exec rm -rf {} +
	find . -type f \( -name "*.py[co]" -o -name "*.so" -o -name "*.egg" -o -name ".coverage" -o -name "coverage.xml" \) -delete
	rm -rf dist/ build/ .benchmarks/ .hypothesis/

# Build & Deployment
build: ## Build wheel and source distributions
	poetry build

deploy: ## Deploy to PyPI (requires configured credentials)
	poetry publish


# Advanced Tooling
pre-commit: ## Install pre-commit hooks
	poetry run pre-commit install
	poetry run pre-commit autoupdate

docker: ## Build and run Docker container
	docker build -t myapp .
	docker run -it --rm -p 8000:8000 myapp

watch: ## Auto-rerun tests on file changes
	poetry run ptw --now . -- tests/
	@echo "Watching for changes in tests/ directory..."
	@echo "Press Ctrl+C to stop watching."	