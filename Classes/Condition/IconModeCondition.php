<?php
namespace Vancado\VncInteractiveImage\Condition;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Database\ConnectionPool;

class IconModeCondition
{
    public function checkIconMode(array $parameters): bool
    {
        $record = $parameters['record'];

        if (!empty($record['interactive_image'])) {
            $interactiveImageUid = (int)$record['interactive_image'];
            $queryBuilder = GeneralUtility::makeInstance(ConnectionPool::class)
                ->getQueryBuilderForTable('tt_content');

            $interactiveImage = $queryBuilder
                ->select('tx_vncinteractiveimage_icon_mode')
                ->from('tt_content')
                ->where(
                    $queryBuilder->expr()->eq('uid', $queryBuilder->createNamedParameter($interactiveImageUid, \PDO::PARAM_INT))
                )
                ->execute()
                ->fetch();

            if ($interactiveImage !== false) {
                return $interactiveImage['tx_vncinteractiveimage_icon_mode'] === 'different';
            }
        }

        return false;
    }
}
