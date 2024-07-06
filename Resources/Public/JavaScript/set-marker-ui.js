import DocumentService from '@typo3/core/document-service.js';

class SetMarkerUi
{
    config = []

    markers = {}

    observers = {}

    constructor() {
        this.init()
    }

    init() {
        document.querySelector('#setMarkerImage')?.addEventListener('click', (e) => {
            const button = document.querySelector('[data-local-field="tx_vncinteractiveimage_marks"] .typo3-newRecordLink button')
            const xPercentage = parseFloat(e.offsetX / e.target.offsetWidth).toFixed(2)
            const yPercentage = parseFloat(e.offsetY / e.target.offsetHeight).toFixed(2)

            button.click()

            setTimeout(() => {
                const newIrreMarker = document.querySelector('[data-local-field="tx_vncinteractiveimage_marks"] .panel-group > div:last-child');
                const fieldX = document.querySelector('[data-local-field="tx_vncinteractiveimage_marks"] .panel-group > div:last-child [data-formengine-input-name*=position_x]')
                const fieldY = document.querySelector('[data-local-field="tx_vncinteractiveimage_marks"] .panel-group > div:last-child [data-formengine-input-name*=position_y]')
                const fieldText = document.querySelector('[data-local-field="tx_vncinteractiveimage_marks"] .panel-group > div:last-child [data-formengine-input-name*=text]')
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

        document.querySelectorAll('.setMarkerMarkers').forEach((marker) => {
            const uid = marker.dataset['markUid']
            const title = marker.dataset['markTitle']
            const positionX = marker.dataset['markPositionX']
            const positionY = marker.dataset['markPositionY']

            this.addMarker(uid, title, positionX, positionY)
            this.setMarkerEventListener(marker)
        })

        document.querySelectorAll('[data-local-field="tx_vncinteractiveimage_marks"] .panel-group > div.panel-collapsed').forEach((panel) => {
            const uid = panel.dataset.objectUid
            this.addObserver(uid, panel)
        })
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
                const uid = panel.dataset.objectUid
                const fieldX = panel.querySelector('[name*=position_x]').value
                const fieldY = panel.querySelector('[name*=position_y]').value
                const fieldText = panel.querySelector('[name*=text]').value

                this.updateMarker(uid, fieldText, fieldX, fieldY)
                this.syncFromMarkers(uid)
            }, 250)
        })
        this.observers[uid].observe(panel, {
            attributes: true,
            childList: true,
            subtree: true
        })
    }

    syncFromMarkers(uid) {
        const marker = this.markers[uid]
        const setMarker = document.querySelector('[data-mark-uid="' + uid + '"]')

        setMarker.setAttribute('title', marker.title)
        setMarker.setAttribute('data-mark-title', marker.title)
        setMarker.setAttribute('data-mark-position-x', marker.x)
        setMarker.setAttribute('data-mark-position-y', marker.y)
        setMarker.style.left = 'calc(' + (marker.x * 100) + '% - 14.5px';
        setMarker.style.top = 'calc(' + (marker.y * 100) + '% - 14.5px';
    }

    addMarkerOnMap(map, uid, x, y) {
        const newMarker = document.createElement('div')

        newMarker.classList.add('set-marker-marker')
        newMarker.style.left = 'calc(' + (x * 100) + '% - 14.5px)'
        newMarker.style.top = 'calc(' + (y * 100) + '% - 14.5px)'
        newMarker.setAttribute('data-mark-uid', uid)

        map.appendChild(newMarker)
        this.setMarkerEventListener(newMarker)
    }

    removeMarker(uid) {
        delete(this.markers[uid])
        this.observers[uid].disconnect()
        delete(this.observers[uid])
    }

    setMarkerEventListener(marker) {
        marker.addEventListener('click', (e) => {
            const uid = e.target.dataset['markUid']
            const markerTabHeader = document.querySelector('[data-local-field="tx_vncinteractiveimage_marks"] .panel-group > div.panel-collapsed[data-object-uid="' + uid + '"] .form-irre-header .form-irre-header-button');
            markerTabHeader?.click()

            setTimeout(() => {
                const fieldText = document.querySelector('[data-local-field="tx_vncinteractiveimage_marks"] .panel-group > div[data-object-uid="' + uid + '"] [data-formengine-input-name*=text]')
                fieldText?.focus()
            }, 250)
        })
    }
}

DocumentService.ready().then(() => {
     window.VncSetMarkerUi = new SetMarkerUi();
});
