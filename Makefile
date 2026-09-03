.PHONY: build build-prod up down logs verify test test-unit test-integration client-new client-deploy client-backup admin open

build:
	cd apps/backend && npm run build
	cd apps/storefront && npm run build

build-prod:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

verify:
	./scripts/verify.sh

test:
	cd apps/backend && TEST_TYPE=unit npm run test:unit

test-unit:
	cd apps/backend && TEST_TYPE=unit npm run test:unit

test-integration:
	cd apps/backend && npm run test:integration:http

client-new:
	@read -p "Client slug: " client; \
	read -p "Domain (default: $${client}.stiamond.store): " domain; \
	./scripts/new-client.sh $$client $${domain:-$${client}.stiamond.store}

client-deploy:
	@read -p "Client slug: " client; \
	./scripts/deploy-client.sh $$client

client-backup:
	@read -p "Client slug: " client; \
	./scripts/backup-client.sh $$client

admin:
	@echo "Admin: http://localhost:9000/app"
	@echo "Email: admin@example.com"
	@echo "Password: password"

open:
	@echo "Storefront: http://localhost:3000"
	@echo "Backend API: http://localhost:9000"
	@echo "Traefik dashboard: http://localhost:8081"
