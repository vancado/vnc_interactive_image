<?php

declare(strict_types=1);

namespace Vancado\VncInteractiveImage\Condition;

use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Utility\GeneralUtility;

final class MarkerTitleCondition
{
    public function isTitleEnabled(array $parameters): bool
    {
        $record = $parameters['record'];

        if (!empty($record['interactive_image'])) {
            $interactiveImageUid = (int)$record['interactive_image'];
            $queryBuilder = GeneralUtility::makeInstance(ConnectionPool::class)
                ->getQueryBuilderForTable('tt_content');

            $interactiveImage = $queryBuilder
                ->select('tx_vncinteractiveimage_show_title_next_to_marker')
                ->from('tt_content')
                ->where(
                    $queryBuilder->expr()->eq('uid', $queryBuilder->createNamedParameter($interactiveImageUid, \PDO::PARAM_INT))
                )
                ->execute()
                ->fetch();

            if ($interactiveImage !== false) {
                return $interactiveImage['tx_vncinteractiveimage_show_title_next_to_marker'] === 1;
            }
        }
        
        return false;
    }
}