import DocumentService from '@typo3/core/document-service.js';
import { Popover } from 'bootstrap';

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
        document.querySelector('#setMarkerImage')?.addEventListener('click', async(e) => {
            const newButton = document.querySelector(this.cssSelectors.newButton)
            const xPercentage = parseFloat(e.offsetX / e.target.offsetWidth).toFixed(2)
            const yPercentage = parseFloat(e.offsetY / e.target.offsetHeight).toFixed(2)
            const maxTrials = 100;
            const that = this;

            let trial = 0;
            let markerAdded = false;
            let result;

            newButton.click()

            function addMarkerInternal() {
                return new Promise(function (resolve, reject) {
                    setTimeout(() => {
                        const newIrreMarker = document.querySelector(that.cssSelectors.panel + ':last-child');
                        const fieldX = document.querySelector(that.cssSelectors.panel + ':last-child [data-formengine-input-name*=position_x]')
                        const fieldY = document.querySelector(that.cssSelectors.panel + ':last-child [data-formengine-input-name*=position_y]')
                        const fieldTitle = document.querySelector(that.cssSelectors.panel + ':last-child [data-formengine-input-name*=title]')
                        const uid = newIrreMarker.dataset.objectUid

                        if (!fieldX) {
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

                        fieldX.value = xPercentage
                        fieldX.dispatchEvent(new Event('change'))
                        fieldY.value = yPercentage
                        fieldY.dispatchEvent(new Event('change'))
                        fieldTitle.focus()

                        resolve(true);
                    }, 50)
                });
            }

            while (trial < maxTrials) {
                if (markerAdded === false) {
                    result = await addMarkerInternal();
                    if (result === true) {
                        markerAdded = true;
                    }
                }
                trial++;
            }
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

    addObserver(uid, panel) {
        this.observers[uid] = new MutationObserver((mutationList, observers) => {
            setTimeout(() => {
                const uid = panel?.dataset?.objectUid
                const x = panel?.querySelector('[name*=position_x]')?.value
                const y = panel?.querySelector('[name*=position_y]')?.value
                const title = panel?.querySelector('[name*=title]')?.value
                const bodytext = panel?.querySelector('[name*=bodytext]')?.value

                this.updateMarker(uid, title, bodytext, x, y)
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
        setMarker.setAttribute('data-mark-bodytext', marker.bodytext)
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
            const fieldTitle = document.querySelector(this.cssSelectors.panel + '[data-object-uid="' + uid + '"] [data-formengine-input-name*=title]')

            fieldX.value = this.markers[uid].x
            fieldX.dispatchEvent(new Event('change'))
            fieldY.value = this.markers[uid].y
            fieldY.dispatchEvent(new Event('change'))
            fieldTitle.value = this.markers[uid].title
        }, 250)
    }

    addMarkerOnMap(map, uid, x, y) {
        const newMarker = document.createElement('div')

        newMarker.classList.add('set-marker-marker')
        newMarker.style.left = 'calc(' + (x * 100) + '% - 14.5px)'
        newMarker.style.top = 'calc(' + (y * 100) + '% - 14.5px)'
        newMarker.setAttribute('data-mark-uid', uid)
        newMarker.setAttribute('draggable', true)

        map.appendChild(newMarker)
        this.setMarkerEventListener(newMarker)
    }

    updateDraggedMarkerOnMap(marker, x, y) {
        const uid = marker.dataset['markUid']
        const title = marker.getAttribute('title')
        const bodytext = marker.dataset['markBodytext']

        marker.style.left = 'calc(' + (x * 100) + '% - 14.5px)'
        marker.style.top = 'calc(' + (y * 100) + '% - 14.5px)'
        marker.setAttribute('mark-position-x', x)
        marker.setAttribute('mark-position-y', y)

        this.updateMarker(uid, title, bodytext, x, y)
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
                const fieldTitle = document.querySelector(this.cssSelectors.panel + '[data-object-uid="' + uid + '"] [data-formengine-input-name*=title]')
                fieldTitle?.focus()
            }, 250)
        })

        marker.addEventListener('dragend', (e) => {
            const X = parseFloat(this.markers[uid].x)
            const Y = parseFloat(this.markers[uid].y)
            const xPercentage = X + parseFloat(parseFloat(e.offsetX / map.offsetWidth).toFixed(2))
            const yPercentage = (Y + parseFloat(parseFloat(e.offsetY / map.offsetHeight).toFixed(2))).toFixed(2)

            this.updateDraggedMarkerOnMap(marker, xPercentage, yPercentage)
        })

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
    }
}

DocumentService.ready().then(() => {
    window.VncSetMarkerUi = new SetMarkerUi();
});
