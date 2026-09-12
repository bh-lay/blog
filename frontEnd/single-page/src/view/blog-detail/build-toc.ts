export interface TocItem {
	indent: number
	text: string
	id: string
}

function prefixID (htmlPart: string) {
	const idMatches = htmlPart.match(/^<h\d\s[^>]*data-id=(?:"|')([^"']+)/)
	let id = ''
	if (idMatches) {
		id = idMatches[1]
	} else {
		id = parseInt(String(Math.random() * 1000), 10) + '_' + parseInt(String(Math.random() * 100 * 100), 10)
		htmlPart = htmlPart.replace(/(^<h\d)/, `$1 data-id="${id}" `)
	}
	return {
		htmlPart,
		id
	}
}

function extractTextFromHTML (htmlString: string) {
	const div = document.createElement('div')
	div.innerHTML = htmlString
	const text = div.textContent || div.innerText
	return text
}

function buildToc (article: string) {
	const toc: TocItem[] = []
	article = article.replace(/<h(\d)(?:\s[^>]+)*>(.*?)<\/h\d>/g, (htmlPart, indent, innerHTML) => {
		const prefix = prefixID(htmlPart)
		toc.push({
			indent: Number(indent),
			text: extractTextFromHTML(innerHTML),
			// text: innerHTML,
			id: prefix.id
		})
		return prefix.htmlPart
	})
	const minItendent = Math.min.apply(Math, toc.map(item => item.indent))
	toc.forEach(item => {
		item.indent = item.indent - minItendent
	})
	return {
		article,
		toc
	}
}

export default buildToc
