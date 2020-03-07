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
                await entryPage(date, entry)
                break
            }
        case 'tag':
            {
                const tag = component.params['tag.html'].split('.html').slice(0, -1).join('')
                await tagPage(tag)
                break
            }
    }

    if ('puppeteerOnComplete' in window) puppeteerOnComplete()
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
    const res = await fetch(`/archives/${year}/${entryObj.entry}.html`)
    return await res.text()
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
}

async function entryPage(date, entry) {
    const entries = await getEntries()
    const entryObj = entries.find(it => it.date == date && it.entry == entry)

    if (!entryObj) {
        router.redirect('/notfound')
        return
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

    document.querySelectorAll("#share a")[0].href = "https://twitter.com/intent/tweet?text="+ encodeURIComponent(document.getElementById("title").textContent) + "%0a&url=" + encodeURIComponent(location.origin + location.pathname) + "&related=comameito";
    document.querySelectorAll("#share a")[1].href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(location.origin + location.pathname);
}

async function tagPage(tag) {
    document.title = tag + ' | comame.xyz'

    const entries = (await getEntries()).filter(it => it.tags.includes(tag))
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
