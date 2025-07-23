# Makefile - placed in the root directory next to docker-compose.yml

DB_PASSWORD=ELHDD.J!w9bdNnL-
CONTAINER=mysql-db
SQL_FILE=/mysql-init/test-production.sql
DB_NAME=cs348_project

.PHONY: run-sql run-sql-save shell

# Run the SQL file and show nicely formatted output in the terminal
run-sql:
	docker exec -it $(CONTAINER) sh -c "mysql -u root -p'$(DB_PASSWORD)' $(DB_NAME) < $(SQL_FILE)"

run-sql-save:
	docker exec -i $(CONTAINER) sh -c "mysql -t -u root -p'$(DB_PASSWORD)' $(DB_NAME) < $(SQL_FILE)" | tee output.txt

# Open an interactive MySQL shell in the container
shell:
	docker exec -it $(CONTAINER) mysql -u root -p'$(DB_PASSWORD)' $(DB_NAME)
