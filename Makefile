server: node_modules
	npm run $@

lint: node_modules
	npm run $@

test: node_modules
	npm run $@

node_modules: package.json
	npm install
	touch node_modules

build: node_modules
	npm run build

clean:
	rm bundle.js
	rm bundle.js.map
	rm -rf node_modules
