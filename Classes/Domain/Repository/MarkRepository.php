<?php

declare(strict_types=1);

namespace Vancado\VncInteractiveImage\Domain\Repository;

use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Persistence\Generic\Mapper\DataMapper;
use TYPO3\CMS\Extbase\Persistence\Generic\Typo3QuerySettings;
use TYPO3\CMS\Extbase\Persistence\Repository;
use Vancado\VncInteractiveImage\Domain\Model\Mark;

class MarkRepository extends Repository
{
    public function initializeObject()
    {
        /** @var Typo3QuerySettings $querySettings */
        $querySettings = GeneralUtility::makeInstance(Typo3QuerySettings::class);
        $querySettings->setRespectStoragePage(false);
        $querySettings->setIgnoreEnableFields(true);
        $querySettings->setIgnoreEnableFields(true);
        $this->setDefaultQuerySettings($querySettings);
    }

    /**
     * @param int $uid
     * @return InteractiveImage|null
     */
    public function findByInteractiveImageUid(int $uid) {
        /** @var DataMapper $dataMapper */
        $dataMapper = GeneralUtility::makeInstance(DataMapper::class);
        $connection = GeneralUtility::makeInstance(ConnectionPool::class)
            ->getConnectionForTable('tx_vncinteractiveimage_domain_model_mark');

        $queryBuilder = $connection->createQueryBuilder();
        $queryBuilder->getRestrictions()->removeAll();
        $query = $queryBuilder
            ->select('*')
            ->from('tx_vncinteractiveimage_domain_model_mark')
            ->where(
                $queryBuilder->expr()->eq('interactive_image', $queryBuilder->createNamedParameter($uid))
            );

        $rows = $query->executeQuery()->fetchAllAssociative();
        return $dataMapper->map(Mark::class, $rows);
    }
}
