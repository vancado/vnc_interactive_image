<?php

namespace Vancado\VncInteractiveImage\Domain\Repository;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Persistence\Generic\Typo3QuerySettings;
use TYPO3\CMS\Extbase\Persistence\Repository;
use Vancado\VncInteractiveImage\Domain\Model\InteractiveImage;

class InteractiveImageRepository extends Repository
{
    public function initializeObject()
    {
        /** @var Typo3QuerySettings $querySettings */
        $querySettings = GeneralUtility::makeInstance(Typo3QuerySettings::class);
        $querySettings->setRespectStoragePage(false);
        $querySettings->setIgnoreEnableFields(true);
        $this->setDefaultQuerySettings($querySettings);
    }

    /**
     * @param int $uid
     * @return InteractiveImage|null
     */
    public function findByUidAndIgnoreHidden(int $uid): ?InteractiveImage {
        $q = $this->createQuery();
        $q->matching($q->equals('uid', $uid));
        return $q->execute()->getFirst();
    }
}
