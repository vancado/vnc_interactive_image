define(['TYPO3/CMS/Core/DocumentService'], function(DocumentService) {
    var SetMarkerUIModule = {
    };

    SetMarkerUIModule.init = function() {
        console.log('init');
        window.VncSetMarkerUi = new SetMarkerUi();
    };

    DocumentService.ready().then(() => {
        window.vncSetMarkerUIModule = SetMarkerUIModule;
        window.vncSetMarkerUIModule.init();
    });

    return SetMarkerUIModule;
});

class SetMarkerUi
{
    config = []

    markers = {}

    observers = {}

    intervalRemoveMarker = null

    map = null;

    cssSelectors = {
        localField: null,
        newButton: null,
        panel: null,
        panelGroup: null,
    }

    constructor() {
        this.initCssSelectors()
        this.init()
        this.initIntervalRemoveMarker()
        this.configMarkerLayout()
    }

    init() {
        this.map = document.querySelector('#setMarkerImage');

        window.addEventListener('resize', () => {
            this.setPositionsOfAllMarkers()
        })

        // click on map creates a new marker on map and in irre panel
        document.querySelector('#setMarkerImage')?.addEventListener('click', async(e) => {
            const newButton = document.querySelector(this.cssSelectors.newButton)
            const xPercentage = parseFloat(e.offsetX / e.target.offsetWidth).toFixed(2)
            const yPercentage = parseFloat(e.offsetY / e.target.offsetHeight).toFixed(2)
            const that = this;


            let markerAdded = false;
            let result;

            this.addMarkerByMap = true;

            // add irre element
            newButton.click()

            function addMarkerInternal() {
                return new Promise(function (resolve, reject) {
                    setTimeout(() => {
                        const newIrreMarker = document.querySelector(that.cssSelectors.panel + ':last-child');
                        const fieldX = document.querySelector(that.cssSelectors.panel + ':last-child [data-formengine-input-name*=position_x]')
                        const fieldY = document.querySelector(that.cssSelectors.panel + ':last-child [data-formengine-input-name*=position_y]')
                        const fieldTitle = document.querySelector(that.cssSelectors.panel + ':last-child [data-formengine-input-name*=title]')
                        const uid = newIrreMarker.dataset.objectUid

                        if (!fieldX || !fieldY || !fieldTitle || !uid) {
                            resolve(false);
                            return;
                        }

                        if (that.markers[uid]) {
                            resolve(false);
                            return;
                        }

                        that.addMarkerOnMap(
                            e.target.parentElement,
                            uid,
                            xPercentage,
                            yPercentage
                        )
                        that.addMarker(uid, '', '', xPercentage, yPercentage)
                        that.addObserver(uid, newIrreMarker)

                        fieldX.value = xPercentage * 100
                        fieldX.dispatchEvent(new Event('change'))
                        fieldY.value = yPercentage * 100
                        fieldY.dispatchEvent(new Event('change'))
                        fieldTitle.focus()

                        resolve(true);
                    }, 0)
                });
            }

            while (markerAdded === false) {
                result = await addMarkerInternal();
                if (result === true) {
                    markerAdded = true;
                }
            }

            this.addMarkerByMap = false;
        })

        // add existing markers on map and set event listener for each one
        document.querySelectorAll('.setMarkerMarkers').forEach((marker) => {
            const uid = marker.dataset['markUid']
            const title = marker.dataset['markTitle']
            const bodytext = marker.dataset['markBodytext']
            const positionX = marker.dataset['markPositionX']
            const positionY = marker.dataset['markPositionY']

            this.addMarker(uid, title, bodytext, positionX, positionY)
            this.setMarkerEventListener(marker)
        })

        // add obeserver to all existing irre panels
        document.querySelectorAll(this.cssSelectors.panel).forEach((panel) => {
            const uid = panel.dataset.objectUid
            this.addObserver(uid, panel)
        })

        // Add a new marker on map if new button is clicked
        document.querySelector(this.cssSelectors.newButton)?.addEventListener('click', () => {
            if (this.addMarkerByMap === true) {
                return;
            }
            setTimeout(() => {
                const map = document.querySelector('#setMarkerImage')
                const newIrreMarker = document.querySelector(this.cssSelectors.panel + ':last-child')
                const uid = newIrreMarker.dataset.objectUid

                this.addMarkerOnMap(
                    map.parentElement,
                    uid,
                    0.0,
                    0.0
                )
                this.addMarker(uid, '', '', 0.0, 0.0)
                this.addObserver(uid, newIrreMarker)
            }, 250)
        })
    }

    initCssSelectors() {
        const localField = '[data-local-field="tx_vncinteractiveimage_marks"]'
        const panelGroup = localField + ' .panel-group'
        const panel = panelGroup + ' > div'
        const newButton = localField + ' .typo3-newRecordLink button'

        this.cssSelectors = {
            localField,
            newButton,
            panel,
            panelGroup,
        }
    }

    initIntervalRemoveMarker() {
        if (document.querySelector(this.cssSelectors.localField) === null) {
            return
        }
        this.intervalRemoveMarker = setInterval(() => {
            document.querySelectorAll('[data-mark-uid]').forEach((markerOnMap) => {
                const uid = markerOnMap.dataset.markUid
                const panel = document.querySelector(this.cssSelectors.panel + '[data-object-uid="' + uid + '"]')
                if (!panel) {
                    this.removeMarker(uid)
                }
            })
        }, 1000)
    }

    addMarker(uid, title, bodytext, x, y) {
        this.markers[uid] = {
            title,
            bodytext,
            x,
            y,
        }
    }

    updateMarker(uid, title, bodytext, x, y) {
        this.markers[uid] = {
            title,
            bodytext,
            x,
            y,
        }
    }

    calcStyleLeft(x) {
        return (Math.round(this.map.offsetWidth * x) - 21) + 'px'
    }

    calcStyleTop(y) {
        return (Math.round(this.map.offsetHeight * y) - 21) + 'px'
    }

    configMarkerLayout() {
        document.querySelectorAll('#setMarkerImageMap .setMarkerMarkers')?.forEach((marker) => {
            if (null !== marker.querySelector('img')) {
                marker.style.backgroundColor = 'transparent';
                marker.style.borderColor = 'transparent';
            }
        });
    }

    setPositionsOfAllMarkers() {
        const uids = Object.keys(this.markers)
        uids.forEach((uid) => {
            const marker = document.querySelector('[data-mark-uid="' + uid + '"]')
            marker.style.left = this.calcStyleLeft(this.markers[uid].x)
            marker.style.top = this.calcStyleTop(this.markers[uid].y)
        })
    }

    addObserver(uid, panel) {
        if (this.observers[uid]) {
            return;
        }
        this.observers[uid] = new MutationObserver((mutationList, observers) => {
            const that = this
            setTimeout(() => {
                const uid = panel?.dataset?.objectUid
                const x = panel?.querySelector('[name*=position_x]')?.value
                const y = panel?.querySelector('[name*=position_y]')?.value
                const title = panel?.querySelector('[name*=title]')?.value
                const fieldShowTitle = panel?.querySelector('[data-formengine-input-name*=title]')
                const bodytext = panel?.querySelector('[name*=bodytext]')?.value


                if (!x || !y || !title || !bodytext) {
                    return
                }

                if (fieldShowTitle?.value === '') {
                    fieldShowTitle.value = title
                }

                this.updateMarker(uid, title, bodytext, x / 100, y / 100)
                this.syncFromMarker(uid)
            }, 250)
        })
        this.observers[uid].observe(panel, {
            attributes: true,
            childList: true,
            subtree: true
        })
    }

    syncFromMarker(uid) {
        const marker = this.markers[uid]
        const setMarker = document.querySelector('[data-mark-uid="' + uid + '"]')

        if (marker.title !== undefined) setMarker.setAttribute('title', marker.title)
        if (marker.title !== undefined) setMarker.setAttribute('data-mark-title', marker.title)
        if (marker.bodytext !== undefined) setMarker.setAttribute('data-mark-bodytext', marker.bodytext)
        setMarker.setAttribute('data-mark-position-x', marker.x)
        setMarker.setAttribute('data-mark-position-y', marker.y)
        setMarker.style.left = this.calcStyleLeft(marker.x)
        setMarker.style.top = this.calcStyleTop(marker.y)
    }

    async syncFormMarkerOnMap(uid) {
        let markerTabHeader = document.querySelector(this.cssSelectors.panel + '.panel-collapsed[data-object-uid="' + uid + '"] .form-irre-header .form-irre-header-button');
        const setMarker = document.querySelector('[data-mark-uid="' + uid + '"]')
        markerTabHeader?.click()

        if (!markerTabHeader) {
            markerTabHeader = document.querySelector(this.cssSelectors.panel + '.panel-visible[data-object-uid="' + uid + '"] .form-irre-header .form-irre-header-button');
        }

        let panelReady = false
        let result;
        const that = this;

        function copyMarkerDataToPanel() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const panel = document.querySelector(that.cssSelectors.panel + '[data-object-uid="' + uid + '"]')
                    const fieldX = document.querySelector(that.cssSelectors.panel + '[data-object-uid="' + uid + '"] [data-formengine-input-name*=position_x]')
                    const fieldY = document.querySelector(that.cssSelectors.panel + '[data-object-uid="' + uid + '"] [data-formengine-input-name*=position_y]')
                    const fieldTitle = document.querySelector(that.cssSelectors.panel + '[data-object-uid="' + uid + '"] [data-formengine-input-name*=title]')

                    if (!panel || !fieldX || !fieldY || !fieldTitle) {
                        resolve(false);
                        return;
                    }

                    if (fieldX.value === NaN || fieldY.value === NaN || fieldTitle.value === undefined) {
                        resolve(false);
                        return;
                    }

                    fieldX.value = that.markers[uid].x * 100
                    fieldX.dispatchEvent(new Event('change'))
                    fieldY.value = that.markers[uid].y * 100
                    fieldY.dispatchEvent(new Event('change'))
                    fieldTitle.value = that.markers[uid].title

                    resolve(true);
                }, 50)
            });
        }

        while (panelReady === false) {
            result = await copyMarkerDataToPanel();
            if (result === true) {
                panelReady = true;
            }
        }
    }

    addMarkerOnMap(map, uid, x, y) {
        const newMarker = document.createElement('div')

        newMarker.classList.add('set-marker-marker')
        newMarker.style.left = this.calcStyleLeft(x)
        newMarker.style.top = this.calcStyleTop(y)
        newMarker.setAttribute('data-mark-uid', uid)
        newMarker.setAttribute('draggable', true)

        map.appendChild(newMarker)
        this.setMarkerEventListener(newMarker)
    }

    async updateDraggedMarkerOnMap(marker, x, y) {
        const uid = marker.dataset['markUid']
        const title = marker.getAttribute('title')
        const bodytext = marker.dataset['markBodytext']

        marker.style.left = this.calcStyleLeft(x)
        marker.style.top = this.calcStyleTop(y)
        marker.setAttribute('mark-position-x', x)
        marker.setAttribute('mark-position-y', y)

        this.updateMarker(uid, title, bodytext, x, y)
        await this.syncFormMarkerOnMap(uid)
    }

    removeMarker(uid) {
        delete(this.markers[uid])
        this.observers[uid]?.disconnect()
        delete(this.observers[uid])
        document.querySelector('[data-mark-uid="' + uid + '"]')?.remove()
    }

    setMarkerEventListener(marker) {
        const map = document.querySelector('#setMarkerImage')
        const uid = marker.dataset['markUid']

        marker.addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()
            const markerTabHeader = document.querySelector(this.cssSelectors.panel + '.panel-collapsed[data-object-uid="' + uid + '"] .form-irre-header .form-irre-header-button');
            markerTabHeader?.click()

            setTimeout(() => {
                const fieldTitle = document.querySelector(this.cssSelectors.panel + '[data-object-uid="' + uid + '"] [data-formengine-input-name*=title]')
                fieldTitle?.focus()
            }, 250)
        })

        marker.addEventListener('dragend', async (e) => {
            const X = parseFloat(this.markers[uid].x)
            const Y = parseFloat(this.markers[uid].y)
            const xPercentage = X + parseFloat(parseFloat((e.offsetX - 20) / map.offsetWidth).toFixed(4))
            const yPercentage = (Y + parseFloat(parseFloat((e.offsetY - 20) / map.offsetHeight).toFixed(4))).toFixed(4)

            await this.updateDraggedMarkerOnMap(marker, xPercentage, yPercentage)
        })

        /*
        const popover = new Popover(marker, {
            content: function() {
                return marker.dataset['markBodytext']
            },
            html: true,
            title: function() {
                return marker.getAttribute('title')
            },
            trigger: 'hover focus',
        })

         */
    }
}

