.PHONY: serve clean help default

# Default target
default: help

# Start local Python HTTP server on port 8000
serve:
	@echo "Starting blog server at http://localhost:8000/"
	@echo "Press Ctrl+C to stop the server"
	python3 -m http.server 8000 --directory .

# Serve on custom port (usage: make serve-port PORT=3000)
serve-port:
	@if [ -z "$(PORT)" ]; then echo "Usage: make serve-port PORT=8080"; exit 1; fi
	@echo "Starting blog server at http://localhost:$(PORT)/"
	python3 -m http.server $(PORT) --directory .

# Clean temporary files and caches
clean:
	@echo "Cleaning cache files..."
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -name "*.pyc" -delete
	find . -name ".DS_Store" -delete
	@echo "Done!"

# Validate JSON metadata
validate:
	@echo "Validating blogData.json..."
	python3 -m json.tool data/blogData.json > /dev/null && echo "✓ blogData.json is valid" || echo "✗ Invalid JSON"

# Display help
help:
	@echo "Blog Development Makefile"
	@echo ""
	@echo "Available targets:"
	@echo "  make serve            - Start HTTP server on port 8000 (default)"
	@echo "  make serve-port       - Start server on custom port (usage: make serve-port PORT=3000)"
	@echo "  make validate         - Validate blogData.json syntax"
	@echo "  make clean            - Remove cache files (.pyc, __pycache__, .DS_Store)"
	@echo "  make help             - Show this help message"
	@echo ""
	@echo "Quick start:"
	@echo "  make serve            # Then open http://localhost:8000/ in browser"
