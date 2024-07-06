import DocumentService from '@typo3/core/document-service.js';

class SetMarkerUi
{
    config = []

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

                this.addMarkerOnMap(
                    e.target.parentElement,
                    newIrreMarker.dataset.objectUid,
                    xPercentage,
                    yPercentage
                )

                fieldX.value = xPercentage
                fieldX.dispatchEvent(new Event('change'))
                fieldY.value = yPercentage
                fieldY.dispatchEvent(new Event('change'))
                fieldText.focus()
            }, 50)
        })

        document.querySelectorAll('.setMarkerMarkers').forEach((marker) => {
            this.setMarkerEventListener(marker)
        })
    }

    addMarkerOnMap(map, uid, x, y) {
        const newMarker = document.createElement('div');

        newMarker.style.width = '1px'
        newMarker.style.height = '1px'
        newMarker.style.backgroundColor = '#f00'
        newMarker.style.position = 'absolute'
        newMarker.style.left = 'calc(' + (x * 100) + '% - 14.5px)'
        newMarker.style.top = 'calc(' + (y * 100) + '% - 14.5px)'
        newMarker.style.border = '15px solid #f00'
        newMarker.style.borderRadius = '100%'
        newMarker.style.outline = '2px solid #fff'
        newMarker.style.cursor = 'pointer'
        newMarker.setAttribute('data-mark-uid', uid)

        map.appendChild(newMarker)
        this.setMarkerEventListener(newMarker)
    }

    setMarkerEventListener(marker) {
        marker.addEventListener('click', (e) => {
            console.log('clicked', e)
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
