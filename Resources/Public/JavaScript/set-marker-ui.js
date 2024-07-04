import DocumentService from '@typo3/core/document-service.js';

class SetMarkerUi
{
    config = []

    constructor() {
    }
}

DocumentService.ready().then(() => {
     window.VncSetMarkerUi = new SetMarkerUi();
});
