
const getInputTextExample0 = ()=>{
    return "Hello, **World**!" + "\n" + "Hello, *Again*!"
}
const getParseScriptExample0 = ()=>{
    return `\
const show = (resultW)=> {
	if( resultW.r.ok ){
		return resultW.r.xs.map( (it)=> {
			if( it.kind=="italic" ){ return "<i>" + it.text + "</i>" }
			if( it.kind=="bold" ){ return "<b>" + it.text + "</b>" }
			if( it.kind=="lineBreak" ){ return "<br/>" }
			else if( it.kind=="markup" ){ return "" }
			else { return it.text }
		}).join("")
	} else {
		return "NG"
	}
}

const toJust = (t)=> { return { kind: \"just\", text: t } }
const toBold = (t)=> { return { kind: \"bold\", text: t } }
const toItalic = (t)=> { return { kind: \"italic\", text: t } }
const toMarkup = (t)=> { return { kind: \"markup\", text: t } }
const toLineBreak = (t)=> { return { kind: "lineBreak", text: t } }

const boldP = seq(
  one(toMarkup, "**"),
  endBy(toBold, "**"),
  one(toMarkup, "**"))

const italicP = seq(
  one(toMarkup, "*"),
  none("*"),
  endBy(toItalic, "*"),
  one(toMarkup, "*"))

const lineBreakP = one(toLineBreak, "\\n")

const p = zeroOrMore( either( boldP, italicP, lineBreakP, anyone(toJust) ) )
const resultW = runWriter(inputText).parse( p )
show(resultW)
`
}

const getInputTextExample1 = ()=>{
    return "Hello, World!"
}
const getParseScriptExample1 = ()=>{
    return `\
const show = (resultW)=> {
	if( resultW.r.ok ){
		return resultW.r.xs.map( (it)=> {
			return it.text
		}).join("")
	} else {
		return "NG"
	}
}

const toJust = (t)=> { return { kind: \"just\", text: t } }

const p = zeroOrMore( anyone(toJust) )
const resultW = runWriter(inputText).parse( p )
show(resultW)
`
}

const getInputTextExample2 = ()=>{
    return "Hello, World!"
}
const getParseScriptExample2 = ()=>{
    return `\
const show = (resultW)=> {
	if( resultW.r.ok ){
		return resultW.r.xs.map( (it)=> {
			return it.text
		}).join("")
	} else {
		return "NG"
	}
}

const toJust = (t)=> { return { kind: \"just\", text: t } }

const helloP = one(toJust, "Hello")
const worldP = one(toJust, "World")
const commaP = one(toJust, ",")
const spaceP = one(toJust, " ")

const p = seq( helloP, commaP, spaceP, worldP, anyone(toJust) )
const resultW = runWriter(inputText).parse( p )
show(resultW)
`
}

const getInputTextExample3 = ()=>{
    return "Hello, **World**!"
}
const getParseScriptExample3 = ()=>{
    return `\
const show = (resultW)=> {
	if( resultW.r.ok ){
		return resultW.r.xs.map( (it)=> {
			if( it.kind=="bold" ){ return "<b>" + it.text + "</b>" }
			if( it.kind=="markup" ){ return "" }
			else { return it.text }
		}).join("")
	} else {
		return "NG"
	}
}

const toJust = (t)=> { return { kind: \"just\", text: t } }
const toBold = (t)=> { return { kind: \"bold\", text: t } }
const toMarkup = (t)=> { return { kind: \"markup\", text: t } }

const boldP = seq(
  one(toMarkup, "**"),
  endBy(toBold, "**"),
  one(toMarkup, "**"))

const p = zeroOrMore( either(boldP, anyone(toJust)) )
const resultW = runWriter(inputText).parse( p )
show(resultW)
`
}
