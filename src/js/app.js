// map mobile scrollbar 
const map = document.querySelector('.map__main-svg');
if (map) {
    const scrollbarThumb = document.querySelector('.map__main-scrollbar span');
    const svgElem = map.querySelector('svg');
    const mapLabel = map.querySelector('.map__main-label');

    const mapWidth = svgElem.getBoundingClientRect().width;
    const containerWidth = document.querySelector('.map__main').getBoundingClientRect().width;

    let scrollLeft = map.scrollLeft
    let scrollPercent = scrollLeft / (mapWidth - containerWidth)

    let mapVisibleWidth = containerWidth / mapWidth * 100
    let mapHiddenWidth = 100 - mapVisibleWidth
    let scrollBarScroll = mapHiddenWidth * scrollPercent

    scrollbarThumb.style.maxWidth = mapVisibleWidth + '%';
    scrollbarThumb.style.left = 0

    if (window.innerWidth <= 768) {
        map.addEventListener('scroll', () => {
            scrollLeft = map.scrollLeft
            scrollPercent = scrollLeft / (mapWidth - containerWidth)
            scrollBarScroll = mapHiddenWidth * scrollPercent
            scrollbarThumb.style.left = scrollBarScroll + '%';
        })
    }
    else {

        let enter = false;
        svgElem.querySelectorAll('path').forEach(path => {
            path.addEventListener('mouseenter', (e) => {
                enter = true;

                if (!mapLabel.classList.contains('_active')) {
                    mapLabel.classList.add('_active')
                }

                const pos = getWindowRelativeOffset(svgElem, path);

                mapLabel.textContent = path.dataset.title;
                mapLabel.style.left = pos.left + 'px';
                mapLabel.style.top = pos.top + 'px';

                if (path.hasAttribute('data-right')) {
                    mapLabel.style.left = pos.right + 'px';
                }
                else {
                    mapLabel.style.left = pos.left + 'px';
                }
            })

            path.addEventListener('mouseleave', (e) => {
                enter = false
                setTimeout(() => {
                    if (enter == false) {
                        mapLabel.classList.remove('_active')
                    }
                }, 500);
            })
        })

        svgElem.addEventListener('mouseleave', () => {
            mapLabel.classList.remove('_active')
        })
    }
}

function getWindowRelativeOffset(parent, elem) {
    let left = elem.getBoundingClientRect().left - parent.getBoundingClientRect().left + elem.getBoundingClientRect().width / 2;
    let right = elem.getBoundingClientRect().left - parent.getBoundingClientRect().left - elem.getBoundingClientRect().width / 2;
    let top = elem.getBoundingClientRect().top - parent.getBoundingClientRect().top - 70;

    return {
        left,
        right,
        top,
    };
};


const mapResult = document.querySelector('.result-map');
const mapLoading = document.querySelector('.map__main-svg-loading');
document.addEventListener('click', function (e) {
    let targetEl = e.target;

    if (targetEl.classList.contains('has-filial')) {
        mapLoading.classList.add('_open')

        const regionTitle = targetEl.dataset.title ? targetEl.dataset.title : 'Регион не определен';
        const data = {
            'title': regionTitle,
            'regions': ''
        }

        BX.ajax({
            url: '/assets/new-map/ajax.php',
            data: {
                id: targetEl.dataset.id,
                district_id: targetEl.dataset.districtId
            },
            method: 'POST',
            dataType: 'json',
            timeout: 10,
            onsuccess: function (res) {
                data.regions = res
                getRegionData(data)
                openMapResult(targetEl);
            },
            onfailure: e => {
                console.error('error')
                mapLoading.classList.remove('_open')
            }
        })

    }

    if (targetEl.classList.contains('result-map__close')) {
        document.body.classList.remove('_noscroll')

        mapLoading.classList.remove('_open')
        mapLoading.classList.remove('_hide')

        document.querySelector('.map__main-scrollbar').classList.remove('_hide')
        mapResult.classList.remove('_open')
    }
})


function openMapResult(targetEl) {
    document.body.classList.add('_noscroll')

    mapLoading.classList.add('_hide')
    document.querySelector('.map__main-scrollbar').classList.add('_hide')

    mapResult.classList.add('_open')
    mapResult.querySelector('.result-map__map img').src = '';
    mapResult.querySelector('.result-map__map img').src = 'assets/new-map/img/regions/RU-' + targetEl.dataset.url + '.svg';
}

function getRegionData(data) {
    if (!data) return;

    const titleElem = document.querySelector('.result-map__results h3');
    const regionFilialList = document.querySelector('.result-map__results ol');
    const existElems = regionFilialList.querySelectorAll('li');

    if (existElems) {
        existElems.forEach(elem => elem.remove())
    }

    titleElem.textContent = data.title;

    regionFilialList.insertAdjacentHTML('beforeend', data.regions.text);
}