<?php

declare(strict_types=1);

namespace Vancado\VncInteractiveImage\Condition;

use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Database\Query\QueryBuilder;
use TYPO3\CMS\Core\Information\Typo3Version;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Utility\DebuggerUtility;

final class MarkerTitleCondition
{
    public function isTitleEnabled(array $parameters): bool
    {
        $record = $parameters['record'];
        /** @var Typo3Version $typo3Version */
        $typo3Version = GeneralUtility::makeInstance(Typo3Version::class);

        if (!empty($record['interactive_image'])) {
            $interactiveImageUid = (int)$record['interactive_image'];
            /** @var QueryBuilder $queryBuilder */
            $queryBuilder = GeneralUtility::makeInstance(ConnectionPool::class)
                ->getQueryBuilderForTable('tt_content');

            if ($typo3Version->getMajorVersion() >= 13) {
                $interactiveImage = $queryBuilder
                    ->select('tx_vncinteractiveimage_show_title_next_to_marker')
                    ->from('tt_content')
                    ->where(
                        $queryBuilder->expr()->eq('uid', $queryBuilder->createNamedParameter($interactiveImageUid, \Doctrine\DBAL\ParameterType::INTEGER))
                    )
                    ->fetchAssociative();
            } else {
                $interactiveImage = $queryBuilder
                    ->select('tx_vncinteractiveimage_show_title_next_to_marker')
                    ->from('tt_content')
                    ->where(
                        $queryBuilder->expr()->eq('uid', $queryBuilder->createNamedParameter($interactiveImageUid, \PDO::PARAM_INT))
                    )
                    ->execute()
                    ->fetch();
            }

            if ($interactiveImage !== false) {
                return $interactiveImage['tx_vncinteractiveimage_show_title_next_to_marker'] === 1;
            }
        }

        return false;
    }
}
