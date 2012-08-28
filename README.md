coffeebars
==========

Handlebar style micro-templating engine with coffee-script based syntax and logic

## Basic Example

A simple coffeebars template:

	Hello {{@name}}
	You have just won ${{@value}}!
	{{if @in_ca}}Well, ${{@value - @value * @taxRate}}, after taxes.{{end}}

Given the following context:

	name: "Kris"
	value: 10000
	taxRate: 0.4
	in_ca: true

Will produce the following:

	Hello Kris
	You have just won $10000!
	Well, $6000, after taxes.

## Features

### Loops and conditionals

	{{ for item in ['Alpha','Beta','Charlie'] }}
		<li>{{ item }}</li>
	{{ end }}


	{{ for name, value of @people }}
		<tr><td>{{ name }}</td><td>{{ value }}</td></tr>
	{{ end }}


	{{ while x++ < 10 }}
		Hello {{ x }}
	{{ end }}


	{{ if @person?.children? }}
		Children:
		{{ for child in @person.children }}
			Child: {{ child }}
		{{ end }}
	{{ end }}


	{{ if x? }}
		X
	{{ else if y? }}
		Y
	{{ else }}
		Z
	{{ end }}


	{{
		#	you can embed multiline coffeescript statements directly in your template
		x = 12
		y = 10
		z = x * y
	}}
	anything in a single line is assumed to just be an expression value to write
	{{ x * y }}


### 
