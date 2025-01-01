
function prefixID (htmlPart) {
	let idMatches = htmlPart.match(/^<h\d\s[^>]*data-id=(?:"|')([^"']+)/)
	let id = ''
	if (idMatches) {
		id = idMatches[1]
	} else {
		id = parseInt(Math.random() * 1000, 10) + '_' + parseInt(Math.random() * 100 * 100)
		htmlPart = htmlPart.replace(/(^<h\d)/, `$1 data-id="${id}" `)
	}
	return {
		htmlPart,
		id
	}
}
function extractTextFromHTML(htmlString) {
    let div = document.createElement('div');
    div.innerHTML = htmlString;
    let text = div.textContent || div.innerText;
    return text;
}

function buildToc (article) {
	var toc = []
	article = article.replace(/<h(\d)(?:\s[^>]+)*>(.*?)<\/h\d>/g, (htmlPart, indent, innerHTML) => {
		let prefix = prefixID(htmlPart, indent, innerHTML)
		toc.push({
			indent,
			text: extractTextFromHTML(innerHTML),
			// text: innerHTML,
			id: prefix.id
		})
		return prefix.htmlPart
	})
	let minItendent = Math.min.apply(Math, toc.map(item => item.indent))
	toc.forEach(item => {
		item.indent = item.indent - minItendent
	})
	return {
		article,
		toc
	}
}

export default buildToc
