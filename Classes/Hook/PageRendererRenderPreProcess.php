<?php

declare(strict_types=1);

namespace Vancado\VncInteractiveImage\Hook;

use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Http\ApplicationType;
use TYPO3\CMS\Core\Information\Typo3Version;
use TYPO3\CMS\Core\Page\PageRenderer;
use TYPO3\CMS\Core\Utility\GeneralUtility;

final class PageRendererRenderPreProcess
{
    public function addJavaScript(
        array        $params = [],
        PageRenderer $pageRenderer = null,
    ): void
    {
        if (($GLOBALS['TYPO3_REQUEST'] ?? null) instanceof ServerRequestInterface
            && ApplicationType::fromRequest($GLOBALS['TYPO3_REQUEST'])->isBackend()
        ) {
            $typo3Version = GeneralUtility::makeInstance(Typo3Version::class);

            if ($this->isLoggedIn()) {
                if ($typo3Version->getMajorVersion() >= 12) {
                    $pageRenderer->loadJavaScriptModule('@vancado/vncinteractiveimage/set-marker-ui.js');
                } else {
                    $pageRenderer->loadRequireJsModule(
                        'TYPO3/CMS/VncInteractiveImage/SetMarkerUIModule',
                        'function() { console.log("Loaded SetMarkerUIModule"); }'
                    );
                }
            }
        }
    }

    private function isLoggedIn(): bool
    {
        $user = $GLOBALS['BE_USER']->user;
        return isset($user['uid']) && $user['uid'] > 0;
    }
}
