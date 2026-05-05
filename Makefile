install:
	cd backend && npm install
	cd frontend && npm install

backend:
	cd backend && node server.js

frontend:
	cd frontend && npm run dev

run:
	make backend & make frontend

clean:
	rm -rf backend/node_modules
	rm -rf frontend/node_modules