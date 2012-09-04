#!/usr/bin/env coffee
global = do -> this

pimatch = /\{\{\{?([\w\W]*?)\}\}\}?/g

templates = {}
exports.render = render = (context, source) ->
	template = templates[source] ?= exports.toFunction source
	template context
exports.toFunction = (source) -> eval exports.toJavaScript source
exports.toJavaScript = (source) ->
	script = require('coffee-script').compile exports.toCoffeeScript source
	#	remove trailing semicolon
	script.replace /;\s*$/, ''
exports.toCoffeeScript = (source) ->
	#	top down parsing starting with processing instructions
	array = []
	indent = 1
	getIndent = ->
		value = ""
		for i in [0...indent]
			value += '\t'
		value

	push = (text, dent = 0) ->
		array.push getIndent()
		array.push text, '\n'
		indent += dent

	lastIndex = 0
	writeText = (match) ->
		text = source.substring lastIndex, match?.index ? source.length
		lastIndex = pimatch.lastIndex
		push "write #{JSON.stringify text}"

	fixIndent = (pi, match) ->
		smallest = Number.MAX_VALUE
		lines = pi.split /\r\n|\r|\n/
		for line, index in lines when line.trim().length > 0
			if index is 0
				throw new Error "Multiline script cannot start on same line as opening brace:\n#{match[0]}"
			lineIndent = line.match(/^\s*/)?[0].length
			if lineIndent?
				smallest = Math.min smallest, lineIndent
		#	now return the lines, fixing the indent
		currentIndent = getIndent()
		lines.map((x) -> currentIndent + x.substring smallest).join('\n')

	while match = pimatch.exec source
		writeText match

		pi = match[1]
		dent = 0
		if /^\s*(else|catch)\b\s*([\w\W]+)/.test pi
			indent--
			dent = 1
			pi = pi.trim()
		else if /^\s*(if|for|while|unless|try)\s*([\w\W]+)/.test pi
			dent = 1
			pi = pi.trim()
		else if /^\s*end\s*$/.test pi
			indent--
			pi = null
		else if not /\r|\n/.test pi  # single line literal
			escape = match[0].substring(0,3) isnt '{{{'
			pi = "write (#{pi}), #{escape}"
		else
			pi = fixIndent pi, match

		push pi, dent if pi?

	writeText match

	source = array.join ''
	template = """
	template = (write) ->
	#{source}
		return

	return (context, write) ->
		buffer = null
		if not write
			buffer = []
			write = (text) -> buffer.push text if text?
		template.call context, write
		buffer?.join ''
	"""
	template

if require.main is module
	args = process.argv.slice 2
	if args.length is 0
		console.log """
		Usage: coffeebars template
		"""
	else
		console.log exports.parse require('fs').readFileSync args[0], 'utf8'
