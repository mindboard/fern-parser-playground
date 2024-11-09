
const baseScript = "let head=r=>r[0],tail=r=>r.slice(1),currentText=r=>r.text.slice(r.pos),nextParseText=(r,e)=>({text:r.text,pos:r.pos+e}),parseResult=(r,e)=>({ok:r,xs:e}),runWriter=r=>{var e=parseResult(!0,[]);return writer({text:r,pos:0},e)},writer=(n,i)=>({pt:n,r:i,parse:r=>{var e,t,r=r(n);return writer(r.pt,(r=r.r,t=(e=i).ok&&r.ok,e=i.xs.concat(r.xs),parseResult(t,e)))}}),ngWriter=r=>writer(r,parseResult(!1,[])),okWriter=(r,e)=>writer(r,parseResult(!0,e)),endBy=(n,...i)=>{let l=(r,e,t)=>{var n,i,o,s=currentText(r).slice(t);return s.length<e.length?{first:!1,second:t}:(n=e.length,i=s.slice(0,n),o=e,s=i.length,Array.from({length:s},(r,e)=>e).map(r=>({first:i[r],second:o[r]})).filter(r=>r.first==r.second).length==n?{first:!0,second:t}:l(r,e,t+1))};return e=>{var r,t=currentText(e);return t.length<1||(r=i.map(r=>l(e,r,0)).filter(r=>r.first)).length<1?ngWriter(e):(r=r.map(r=>r.second),r=Math.min(...r),okWriter(nextParseText(e,r),[n(t.slice(0,r))]))}},none=t=>r=>{var e=currentText(r);return!(e.length<t.length)&&e.slice(0,t.length)==t?ngWriter(r):okWriter(r,[])},begin=()=>r=>0<r.pos?ngWriter(r):okWriter(r,[]),end=()=>r=>r.pos<r.text.length?ngWriter(r):okWriter(r,[]),anyone=t=>r=>{var e=currentText(r);return e.length<1?ngWriter(r):(e=e[0],okWriter(nextParseText(r,1),[t(e)]))},letter=t=>{let n=/[a-zA-Z]/;return r=>{var e=currentText(r);return!(e.length<1)&&(e=e[0],n.exec(e))?okWriter(nextParseText(r,1),[t(e)]):ngWriter(r)}},one=(t,n)=>r=>{var e=currentText(r);return!(e.length<n.length)&&e.slice(0,n.length)==n?okWriter(nextParseText(r,n.length),[t(n)]):ngWriter(r)},zeroOrMore=e=>{let i=(r,e,t)=>{var n;return!(currentText(e).length<1)&&(n=r(e)).r.ok?i(r,n.pt,t.concat(n.r.xs)):{first:e,second:t}};return r=>{r=i(e,r,[]);return okWriter(r.first,r.second)}},oneOrMore=e=>r=>(e(r).r.ok?zeroOrMore(e):ngWriter)(r),and=(n,i)=>r=>{var e,t;return!(currentText(r).length<1)&&(e=n(r)).r.ok&&(t=i(e.pt)).r.ok?okWriter(t.pt,e.r.xs.concat(t.r.xs)):ngWriter(r)},seq=(...r)=>{var e;return r.length<1?r=>okWriter(r,[]):1==r.length?head(r):(e=head(r),tail(r).reduce((r,e)=>and(r,e),e))},or=(t,n)=>r=>{var e;return currentText(r).length<1?ngWriter(r):(e=t(r)).r.ok?okWriter(e.pt,e.r.xs):(e=n(r)).r.ok?okWriter(e.pt,e.r.xs):ngWriter(r)},either=(...r)=>{var e;return r.length<1?r=>okWriter(r,[]):1==r.length?head(r):(e=head(r),tail(r).reduce((r,e)=>or(r,e),e))},option=t=>r=>{var e;return!(currentText(r).length<1)&&(e=t(r)).r.ok?okWriter(e.pt,e.r.xs):okWriter(r,[])};"

const defaultBorderStyle = "margin-top:1em;padding:0.8em;"

const getInputText = ()=>{
    return document.getElementById("inputtext").value
}

const getMyScript = ()=>{
    const editor = ace.edit("editor")
    return editor.getSession().getValue()
}

const getDefaultInputText = ()=>{
    return "Hello, **World**!" + "\n" + "Hello, *Again*!"
}

const getDefaultMyScript = ()=>{
    return `\
const show = (result)=> {
    if( result.r.ok ){
        const xs = result.r.xs
        return xs.map( (it)=> {
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

const bold = seq(
  one(toMarkup, "**"),
  endBy(toBold, "**"),
  one(toMarkup, "**"))

const italic = seq(
  one(toMarkup, "*"),
  none("*"),
  endBy(toItalic, "*"),
  one(toMarkup, "*"))

const lineBreak = one(toLineBreak, "\\n")

const p = zeroOrMore( either( bold, italic, lineBreak, anyone(toJust) ) )
const result = runWriter(inputText).parse( p )
show(result)
`
}

const doReset = ()=>{
    const eInputText = document.getElementById("inputtext")
    eInputText.value = getDefaultInputText()

    const editor = ace.edit("editor")
    editor.getSession().setValue(getDefaultMyScript())

    document.getElementById("myresultborderrect").style = defaultBorderStyle + "border: dashed 3px #333;"
    document.getElementById("myresult").value = ""
}

const init = ()=>{
    const editor = ace.edit("editor")
    editor.setTheme("ace/theme/monokai-light")
    editor.renderer.setShowGutter(true)
    editor.setKeyboardHandler("ace/keyboard/emacs")
    editor.getSession().setMode("ace/mode/typescript")

    doReset()
}

window.onload = ()=> { init() }

const run = ()=>{
    getQuickJS().then((QuickJS)=>{
        const vm = QuickJS.newContext()
        const inputText = vm.newString(getInputText())
        vm.setProp(vm.global, "inputText", inputText);
        inputText.dispose();

        const result = vm.evalCode( baseScript + "\n" + getMyScript() )
        if( result.error ){
            document.getElementById("myresult").value = vm.getString(result.error)
            document.getElementById("myresultborderrect").style =
                defaultBorderStyle + "border: dashed 3px #b33;"
            result.error.dispose()
        } else {
            document.getElementById("myresult").value = vm.dump(result.value)
            document.getElementById("myresultborderrect").style =
                defaultBorderStyle + "border: dashed 3px #3b3;"
            result.value.dispose()
        }
        vm.dispose()
    })
}
