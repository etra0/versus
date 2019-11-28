// Genero la lista de canciones de videos.
let generateList = () => {
    const t = [...document.getElementsByClassName('style-scope ytd-grid-video-renderer')]
        .filter(d => d.id === 'meta');
    return t.map(d => ({
        title: d.children[0].textContent,
        url: d.children[0].children[1].href,
        views: d.children[1].children[0].children[1].children[0].textContent
    }))
}

let filterBand = (list, name, n) => {
    const selected = [...list.filter(d => d.title.includes(name))]
    selected.splice(n);
    selected.forEach(d => {d.band = name})
    return selected;
}
