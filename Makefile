server: node_modules
	npm run $@

lint: node_modules
	npm run $@

test: node_modules
	npm run $@

node_modules: package.json
	npm install
	touch node_modules

dist/bundle.js: node_modules app/*.js
	npm run build

dist/index.html: index.html
	cp index.html dist/

dist/index.appcache: dist/index.html dist/bundle.js
	@echo "CACHE MANIFEST" > $@
	@echo "# $$(date)" >> $@
	@echo "CACHE:" >> $@
	@cd dist; ls -1 *.js >> index.appcache; cd ..
	@echo "NETWORK:" >> $@
	@echo "*" >> $@

.PHONY: dist

dist: dist/bundle.js dist/index.html dist/index.appcache

clean:
	rm dist/*

mrproper: clean
	rm -rf node_modules
