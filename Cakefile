cb = require './coffeebars'
cs = require 'coffee-script'
fs = require 'fs'
path = require 'path'
cp = require 'child_process'

exec = (command, callback) ->
	child = cp.exec command
	child[stream].on 'data', console.log for stream in ['stdout', 'stderr']
	child.on 'exit', callback if callback?

list = (options) ->
	dir = options.dir
	match = options.match
	recursive = options.recursive ? true
	matches = (value) ->
		return true unless match?
		return match value if 'function' is typeof match
		return match.test value
	files = []
	for file in fs.readdirSync(dir)
		file = path.join dir, file
		if fs.statSync(file)?.isFile?()
			files.push file if matches file
		else if recursive
			files = files.concat list file, ext, recursive
	files

test = ->
	results = {}
	templates = list
		dir: 'test'
		match: /\.template$/
	for template in templates
		source = fs.readFileSync template, 'utf8'
		expected = fs.readFileSync template.replace(/\.template$/, '.result'), 'utf8'
		context = cs.eval fs.readFileSync template.replace(/\.template$/, '.coffee'), 'utf8'
		compiled = cb.toFunction source
		result = compiled context
		if result != expected
			console.log result
			results[template] =
				template: source
				context: context
				'expected': expected
				'actual  ': result
		else
			results[template] = true
		# console.log cb.toJavaScript source
	results

minify = (source) ->
	jsp = require("uglify-js").parser
	pro = require("uglify-js").uglify

	ast = jsp.parse source
	ast = pro.ast_mangle ast
	ast = pro.ast_squeeze ast
	final = pro.gen_code ast
	final

task 'test1', 'parses a test template', ->
	source = fs.readFileSync 'test/mustache.template', 'utf8'
	parsed = cb.parse source
	console.log parsed.toString()

task 'test', 'parses a test template', ->
	results = test()
	console.log JSON.stringify results, null, '    '

task 'build', 'builds the coffeebars.js and package.json', ->
	#	build coffeebars.js
	exec 'coffee -c coffeebars.coffee', ->
		#	build coffeebars_min.js
		source = fs.readFileSync 'coffeebars.js', 'utf8'
		#	rewrite with shebang
		fs.writeFileSync 'coffeebars.js', "#!/usr/bin/env node\n#{source}", 'utf8'
		source = minify source
		fs.writeFileSync 'coffebars_min.js', source, 'utf8'
		#	build package.json
		content = cs.eval fs.readFileSync 'package.coffee', 'utf8'
		fs.writeFileSync 'package.json', JSON.stringify(content, null, '    '), 'utf8'
