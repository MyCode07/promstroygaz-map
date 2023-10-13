// map mobile scrollbar 
const map = document.querySelector('.map__main-svg');

if (map && window.innerWidth <= 768) {
    const scrollbarThumb = document.querySelector('.map__main-scrollbar span');

    const mapWidth = map.querySelector('svg').getBoundingClientRect().width;
    const containerWidth = document.querySelector('.map__main').getBoundingClientRect().width;

    let scrollLeft = map.scrollLeft
    let scrollPercent = scrollLeft / (mapWidth - containerWidth)

    let mapVisibleWidth = containerWidth / mapWidth * 100
    let mapHiddenWidth = 100 - mapVisibleWidth
    let scrollBarScroll = mapHiddenWidth * scrollPercent

    scrollbarThumb.style.maxWidth = mapVisibleWidth + '%';
    scrollbarThumb.style.left = 0

    map.addEventListener('scroll', () => {
        scrollLeft = map.scrollLeft
        scrollPercent = scrollLeft / (mapWidth - containerWidth)
        scrollBarScroll = mapHiddenWidth * scrollPercent
        scrollbarThumb.style.left = scrollBarScroll + '%';
    })
}

const mapResult = document.querySelector('.result-map')
document.addEventListener('click', function (e) {
    let targetEl = e.target;

    if (targetEl.classList.contains('has-filial')) {
        map.classList.add('_hide')
        document.querySelector('.map__main-scrollbar').classList.add('_hide')
        mapResult.classList.add('_open')
        mapResult.querySelector('.result-map__map img').src = 'img/regions/RU-' + targetEl.dataset.url + '.svg';

        const regionTitle = targetEl.dataset.title ? targetEl.dataset.title : 'Регион не определен';
        const regionFilials = `<li>Филиалы в регионе</li>` ? `<li>Филиалы в регионе</li>` : `<li>Регион не определен</li>`;

        const data = {
            'title': regionTitle,
            'regions': regionFilials
        }

        getRegionData(data)
    }

    if (targetEl.classList.contains('result-map__close')) {
        map.classList.remove('_hide')
        document.querySelector('.map__main-scrollbar').classList.remove('_hide')
        mapResult.classList.remove('_open')
    }
})


function getRegionData(data) {
    if (!data) return;

    const titleElem = document.querySelector('.result-map__results h3');
    const regionFilialList = document.querySelector('.result-map__results ol');
    const existElems = regionFilialList.querySelectorAll('li');

    if (existElems) {
        existElems.forEach(elem => elem.remove())
    }

    titleElem.textContent = data.title;

    regionFilialList.insertAdjacentHTML('beforeend', data.regions);
}