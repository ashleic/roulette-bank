.PHONY: install backend frontend run clean

install:
	cd backend && npm install
	cd frontend && npm install

backend:
	cd backend && node server.js

frontend:
	cd frontend && npm run dev

run:
	concurrently "cd backend && node server.js" "cd frontend && npm run dev"

clean:
	rm -rf backend/node_modules
	rm -rf frontend/node_modules