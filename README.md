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

### Context references

	The context object is used as 'this' within the render function so
	you refer to those objects using the @ symbol or with the 'this' keyword.
	{{ @name }}
	{{ this.name }}
	{{ @child?.name }}

### Loops

	{{ for item in ['Alpha','Beta','Charlie'] }}
		<li>{{ item }}</li>
	{{ end }}


	{{ for name, value of @people }}
		<tr><td>{{ name }}</td><td>{{ value }}</td></tr>
	{{ end }}


	{{ while x++ < 10 }}
		Hello {{ x }}
	{{ end }}

### Conditionals

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

### Multiline statements

	{{
		#	any multiline statement will not be written out
		x = 12
		y = 10
		z = x * y
		if z > x
			x += 2
	}}
