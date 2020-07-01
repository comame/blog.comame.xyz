router.enableLog()

Object.prototype.with = function(func) {
    func(this)
    return this
}

router.initialize([{
    path: '/',
    component: 'home'
}, {
    path: '/entries/:date/:entry.html',
    component: 'entry'
}, {
    path: '/tags/:tag.html',
    component: 'tag'
}, {
    path: '/notfound',
    component: 'notfound'
}, {
    path: '/entries/:date/:entry.html',
    for: 'history',
    component: 'history'
}, {
    path: '/entries/:date/:entry.html',
    for: 'source',
    component: 'source'
}, {
    notfound: '/notfound'
}], {
    mode: 'history'
})

window.addEventListener('component-create', async e => {
    const component = e.detail.component

    switch (component.name) {
        case 'home':
            {
                await homePage()
                break
            }
        case 'entry':
            {
                const date = component.params.date
                const entry = component.params['entry.html'].split('.html').slice(0, -1).join('')
                try {
                    await entryPage(date, entry)
                } catch (err) {
                    return
                }
                break
            }
        case 'tag':
            {
                const tag = component.params['tag.html'].split('.html').slice(0, -1).join('')
                try {
                    await tagPage(tag)
                } catch (err) {
                    return
                }
                break
            }
    }

    document.getElementById('build-status').with(it => {
        const date = new Date().toUTCString()
        it.title = date
    })

    addCanonicalLink()

    console.log('rendering complete')
    const complete = document.createElement('meta').with(meta => {
        meta.name = 'x-render-complete'
    })
    document.head.appendChild(complete)
})

async function getEntries() {
    if (window.entries) return window.entries

    const res = await fetch('/archives/entries.json')
    const json = await res.json()
    window.entries = json

    return json
}

async function getEntry(entryObj) {
    const year = entryObj.date.split('-')[0]
    const res = await fetch(`/archives/${year}/${entryObj.entry}.${entryObj.type}`)
    const text = await res.text()

    if (entryObj.type == 'html') {
        return text
    } else if (entryObj.type == 'md') {
        const renderer = new marked.Renderer()
        renderer.link = function(href, title, text) {
            if (
                href.startsWith('http://') ||
                href.startsWith('https://') ||
                href.startsWith('//')
            ) {
                return `<a href=${href} target='_blank' rel='noopener'>${text}</a>`
            } else {
                return `<a href=${href}>${text}</a>`
            }
        }

        return marked(text, {
            headerIds: false,
            renderer
        })
    }
}

function generateOgp(description) {
    const type = document.createElement('meta').with(it => {
        it.setAttribute('property', 'og:type')
        it.content = 'article'
    })
    const url = document.createElement('meta').with(it => {
        it.setAttribute('property', 'og:url')
        it.content = location.href
    })
    const title = document.createElement('meta').with(it => {
        it.setAttribute('property', 'og:title')
        it.content = document.title
    })
    const siteName = document.createElement('meta').with(it => {
        it.setAttribute('property', 'og:site_name')
        it.content = 'blog.comame.xyz'
    })
    const property = document.createElement('meta').with(it => {
        it.setAttribute('property', 'og:description')
        it.content = description
    })

    const descriptionEl = document.createElement('meta').with(it => {
        it.name = 'description'
        it.content = description
    })

    document.head.appendChild(type)
    document.head.appendChild(url)
    document.head.appendChild(title)
    document.head.appendChild(siteName)
    document.head.appendChild(property)
    document.head.appendChild(descriptionEl)
}

function addCanonicalLink() {
    const link = document.createElement('link').with(it => {
        it.rel = 'canonical'
        it.href = 'https://blog.comame.xyz' + location.pathname
    })
    document.head.appendChild(link)
}

async function homePage() {
    const entries = await getEntries()
    entries.sort((a, b) => {
        const [aYear, aMonth, aDay] = a.date.split('-').map(it => Number.parseInt(it))
        const [bYear, bMonth, bDay] = b.date.split('-').map(it => Number.parseInt(it))

        if (aYear != bYear) return bYear - aYear
        if (aMonth != bMonth) return bMonth - aMonth
        return bDay - aDay
    })

    const entriesByYear = new Map()
    for (const entry of entries) {
        const year = Number.parseInt(entry.date.split('-')[0])
        const obj = entriesByYear.get(year)
        if (obj) {
            obj.push(entry)
        } else {
            entriesByYear.set(year, [entry])
        }
    }

    const years = Array.from(entriesByYear.keys()).sort((a, b) => b - a)
    for (const year of years) {
        const h2 = document.createElement('h2').with(it => {
            it.textContent = year
        })
        const ul = document.createElement('ul').with(it => {
            it.classList.add('entries')
        })

        for (const entry of entriesByYear.get(year)) {
            const { entry: entryName, title, tags, date } = entry
            const li = document.createElement('li')

            const time = document.createElement('time').with(it => {
                it.datetime = date
                it.textContent = date.split('-').slice(1).join('-')
            })
            const a = document.createElement('a').with(it => {
                it.classList.add('entry')
                it.href = `/entries/${date}/${entryName}.html`
                it.textContent = title
            })

            const tagUl = document.createElement('ul').with(it => {
                it.classList.add('tag-list')
            })
            for (const tag of tags) {
                const a = document.createElement('a').with(it => {
                    it.href = `/tags/${tag}.html`
                    it.textContent = tag
                })
                const li = document.createElement('li')
                li.appendChild(a)
                tagUl.appendChild(li)
            }

            li.appendChild(time)
            li.appendChild(a)
            li.appendChild(tagUl)
            ul.appendChild(li)
        }
        router.current().element.appendChild(h2)
        router.current().element.appendChild(ul)
    }

    generateOgp('blog.comame.xyz')
}

async function entryPage(date, entry) {
    const entries = await getEntries()
    const entryObj = entries.find(it => it.date == date && it.entry == entry)

    if (!entryObj) {
        router.redirect('/notfound')
        throw 1
    }

    document.title = entryObj.title + ' | blog.comame.xyz'
    const text = await getEntry(entryObj)

    document.querySelector('time').with(it => {
        it.datetime = entryObj.date
        it.textContent = entryObj.date
    })
    document.querySelector('h1').with(it => {
        it.textContent = entryObj.title
    })

    const tagUl = document.querySelector('ul')
    for (const tag of entryObj.tags) {
        const a = document.createElement('a').with(it => {
            it.href = `/tags/${tag}.html`
            it.textContent = tag
        })
        const li = document.createElement('li')
        li.appendChild(a)
        tagUl.appendChild(li)
    }
    document.getElementById('content').innerHTML = text

    document.querySelectorAll("#share a")[0].href = "https://twitter.com/intent/tweet?text="+ encodeURIComponent(document.getElementById("title").textContent) + "%0a&url=" + encodeURIComponent('https://blog.comame.xyz' + location.pathname) + "&related=comameito";
    document.querySelectorAll("#share a")[1].href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent('https://blog.comame.xyz' + location.pathname);

    const cloneContentNode = document.getElementById('content').cloneNode(true)
    cloneContentNode.querySelectorAll('#content > h2, #content > h3, #content > h4, #content > h5, #content > h6').forEach(it => {
        cloneContentNode.removeChild(it)
    })
    const description = cloneContentNode.textContent.replace(/\n/g, ' ').replace(/\s+/, ' ').slice(0, 137) + '...'

    const year = entryObj.date.split('-')[0]
    const filename = entryObj.entry + '.' + entryObj.type
    const githubHistoryUrl = `https://github.com/comame/blog.comame.xyz/commits/master/archives/${year}/${filename}`
    const githubSourceUrl = `https://github.com/comame/blog.comame.xyz/blob/master/archives/${year}/${filename}`
    document.getElementById('history').href = githubHistoryUrl
    document.getElementById('source').href = githubSourceUrl

    generateOgp(description)
}

async function tagPage(tag) {
    document.title = tag + ' | comame.xyz'

    const entries = (await getEntries()).filter(it => it.tags.includes(tag))

    if (entries.length == 0) {
        router.redirect('/notfound')
        throw 1
    }

    entries.sort((a, b) => {
        const [aYear, aMonth, aDay] = a.date.split('-').map(it => Number.parseInt(it))
        const [bYear, bMonth, bDay] = b.date.split('-').map(it => Number.parseInt(it))

        if (aYear != bYear) return bYear - aYear
        if (aMonth != bMonth) return bMonth - aMonth
        return bDay - aDay
    })

    const h2 = document.createElement('h2').with(it => {
        it.textContent = tag
    })

    const ul = document.createElement('ul').with(it => {
        it.classList.add('entries')
    })

    for (const entry of entries) {
        const { entry: entryName, title, tags, date } = entry
        const li = document.createElement('li')

        const time = document.createElement('time').with(it => {
            it.datetime = date
            it.textContent = date
        })
        const a = document.createElement('a').with(it => {
            it.classList.add('entry')
            it.href = `/entries/${date}/${entryName}.html`
            it.textContent = title
        })

        const tagUl = document.createElement('ul').with(it => {
            it.classList.add('tag-list')
        })
        for (const tag of tags) {
            const a = document.createElement('a').with(it => {
                it.href = `/tags/${tag}.html`
                it.textContent = tag
            })
            const li = document.createElement('li')
            li.appendChild(a)
            tagUl.appendChild(li)
        }

        li.appendChild(time)
        li.appendChild(a)
        li.appendChild(tagUl)
        ul.appendChild(li)
    }

    router.current().element.appendChild(h2)
    router.current().element.appendChild(ul)
}
