import DocumentService from '@typo3/core/document-service.js';

class SetMarkerUi
{
    config = []

    markers = {}

    observers = {}

    intervalRemoveMarker = null

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
    }

    init() {
        // click on map creates a new marker on map and in irre panel
        document.querySelector('#setMarkerImage')?.addEventListener('click', (e) => {
            const newButton = document.querySelector(this.cssSelectors.newButton)
            const xPercentage = parseFloat(e.offsetX / e.target.offsetWidth).toFixed(2)
            const yPercentage = parseFloat(e.offsetY / e.target.offsetHeight).toFixed(2)

            newButton.click()

            setTimeout(() => {
                const newIrreMarker = document.querySelector(this.cssSelectors.panel + ':last-child');
                const fieldX = document.querySelector(this.cssSelectors.panel + ':last-child [data-formengine-input-name*=position_x]')
                const fieldY = document.querySelector(this.cssSelectors.panel + ':last-child [data-formengine-input-name*=position_y]')
                const fieldText = document.querySelector(this.cssSelectors.panel + ':last-child [data-formengine-input-name*=text]')
                const uid = newIrreMarker.dataset.objectUid

                this.addMarkerOnMap(
                    e.target.parentElement,
                    uid,
                    xPercentage,
                    yPercentage
                )
                this.addMarker(uid, '', xPercentage, yPercentage)
                this.addObserver(uid, newIrreMarker)

                fieldX.value = xPercentage
                fieldX.dispatchEvent(new Event('change'))
                fieldY.value = yPercentage
                fieldY.dispatchEvent(new Event('change'))
                fieldText.focus()
            }, 50)
        })

        // add existing markers on map and set event listener for each one
        document.querySelectorAll('.setMarkerMarkers').forEach((marker) => {
            const uid = marker.dataset['markUid']
            const title = marker.dataset['markTitle']
            const positionX = marker.dataset['markPositionX']
            const positionY = marker.dataset['markPositionY']

            this.addMarker(uid, title, positionX, positionY)
            this.setMarkerEventListener(marker)
        })

        // add obeserver to all existing irre panels
        document.querySelectorAll(this.cssSelectors.panel).forEach((panel) => {
            const uid = panel.dataset.objectUid
            this.addObserver(uid, panel)
        })

        // Add a new marker on map if new button is clicked
        document.querySelector(this.cssSelectors.newButton)?.addEventListener('click', () => {
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
                this.addMarker(uid, '', 0.0, 0.0)
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

    addMarker(uid, title, x, y) {
        this.markers[uid] = {
            title,
            x,
            y,
        }
    }

    updateMarker(uid, title, x, y) {
        this.markers[uid] = {
            title,
            x,
            y,
        }
    }

    addObserver(uid, panel) {
        this.observers[uid] = new MutationObserver((mutationList, observers) => {
            setTimeout(() => {
                const uid = panel?.dataset?.objectUid
                const fieldX = panel?.querySelector('[name*=position_x]')?.value
                const fieldY = panel?.querySelector('[name*=position_y]')?.value
                const fieldText = panel?.querySelector('[name*=text]')?.value

                this.updateMarker(uid, fieldText, fieldX, fieldY)
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

        setMarker.setAttribute('title', marker.title)
        setMarker.setAttribute('data-mark-title', marker.title)
        setMarker.setAttribute('data-mark-position-x', marker.x)
        setMarker.setAttribute('data-mark-position-y', marker.y)
        setMarker.style.left = 'calc(' + (marker.x * 100) + '% - 14.5px';
        setMarker.style.top = 'calc(' + (marker.y * 100) + '% - 14.5px';
    }
    
    syncFormMarkerOnMap(uid) {
        const markerTabHeader = document.querySelector(this.cssSelectors.panel + '.panel-collapsed[data-object-uid="' + uid + '"] .form-irre-header .form-irre-header-button');
        const setMarker = document.querySelector('[data-mark-uid="' + uid + '"]')
        markerTabHeader?.click()

        setTimeout(() => {
            const panel = document.querySelector(this.cssSelectors.panel + '[data-object-uid="' + uid + '"]')
            const fieldX = document.querySelector(this.cssSelectors.panel + '[data-object-uid="' + uid + '"] [data-formengine-input-name*=position_x]')
            const fieldY = document.querySelector(this.cssSelectors.panel + '[data-object-uid="' + uid + '"] [data-formengine-input-name*=position_y]')
            const fieldText = document.querySelector(this.cssSelectors.panel + '[data-object-uid="' + uid + '"] [data-formengine-input-name*=text]')

            fieldX.value = this.markers[uid].x
            fieldX.dispatchEvent(new Event('change'))
            fieldY.value = this.markers[uid].y
            fieldY.dispatchEvent(new Event('change'))
            fieldText.value = this.markers[uid].title
        }, 250)
    }

    addMarkerOnMap(map, uid, x, y) {
        const newMarker = document.createElement('div')

        newMarker.classList.add('set-marker-marker')
        newMarker.style.left = 'calc(' + (x * 100) + '% - 14.5px)'
        newMarker.style.top = 'calc(' + (y * 100) + '% - 14.5px)'
        newMarker.setAttribute('data-mark-uid', uid)
        newMarker.setAttribute('draggabe', true)

        map.appendChild(newMarker)
        this.setMarkerEventListener(newMarker)
    }

    updateDraggedMarkerOnMap(marker, x, y) {
        const uid = marker.dataset['markUid']
        const title = marker.getAttribute('title')

        marker.style.left = 'calc(' + (x * 100) + '% - 14.5px)'
        marker.style.top = 'calc(' + (y * 100) + '% - 14.5px)'
        marker.setAttribute('mark-position-x', x)
        marker.setAttribute('mark-position-y', y)

        this.updateMarker(uid, title, x, y)
        this.syncFormMarkerOnMap(uid)
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
            const markerTabHeader = document.querySelector(this.cssSelectors.panel + '.panel-collapsed[data-object-uid="' + uid + '"] .form-irre-header .form-irre-header-button');
            markerTabHeader?.click()

            setTimeout(() => {
                const fieldText = document.querySelector(this.cssSelectors.panel + '[data-object-uid="' + uid + '"] [data-formengine-input-name*=text]')
                fieldText?.focus()
            }, 250)
        })

        marker.addEventListener('dragstart', (e) => {
        })

        marker.addEventListener('dragend', (e) => {
            const title = marker.getAttribute('title')
            const X = parseFloat(this.markers[uid].x)
            const Y = parseFloat(this.markers[uid].y)
            const xPercentage = X + parseFloat(parseFloat(e.offsetX / map.offsetWidth).toFixed(2))
            const yPercentage = (Y + parseFloat(parseFloat(e.offsetY / map.offsetHeight).toFixed(2))).toFixed(2)

            this.updateDraggedMarkerOnMap(marker, xPercentage, yPercentage)
        })
    }
}

DocumentService.ready().then(() => {
     window.VncSetMarkerUi = new SetMarkerUi();
});
