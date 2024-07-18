<?php

declare(strict_types=1);

namespace Vancado\VncInteractiveImage\Hook;

use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Http\ApplicationType;
use TYPO3\CMS\Core\Page\PageRenderer;

final class PageRendererRenderPreProcess
{
    public function addJavaScript(
        array $params = [],
        PageRenderer $pageRenderer = null,
    ): void {
        if (($GLOBALS['TYPO3_REQUEST'] ?? null) instanceof ServerRequestInterface
            && ApplicationType::fromRequest($GLOBALS['TYPO3_REQUEST'])->isBackend()
        ) {
            if ($this->isLoggedIn()) {
                $pageRenderer->loadJavaScriptModule('@vancado/vncinteractiveimage/set-marker-ui.js');
            }
        }
    }

    private function isLoggedIn(): bool
    {
        $user = $GLOBALS['BE_USER']->user;
        return isset($user['uid']) && $user['uid'] > 0;
    }
}