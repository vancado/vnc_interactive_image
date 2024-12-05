<?php

namespace Vancado\VncInteractiveImage\Condition;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Database\ConnectionPool;
use Vancado\VncInteractiveImage\Domain\Model\InteractiveImage;
use Vancado\VncInteractiveImage\Domain\Repository\InteractiveImageRepository;

class IconModeCondition
{
    public function checkIconMode(array $parameters): bool
    {
        $record = $parameters['record'];

        if (!empty($record['interactive_image'])) {
            $interactiveImageUid = (int)$record['interactive_image'];

            $interactiveImageRepository = GeneralUtility::makeInstance(InteractiveImageRepository::class);
            /** @var InteractiveImage $interactiveImage */
            $interactiveImage = $interactiveImageRepository->findByUidAndIgnoreHidden($interactiveImageUid);

            if ($interactiveImage !== null) {
                return $interactiveImage->getTxVncinteractiveimageIconMode() === 'different';
            }
        }

        return false;
    }
}
