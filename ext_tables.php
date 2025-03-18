<?php

defined('TYPO3') or die();

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Information\Typo3Version;

call_user_func(function () {
    $typo3Version = GeneralUtility::makeInstance(Typo3Version::class);

    ExtensionManagementUtility::addStaticFile(
        'vnc_interactive_image',
        'Configuration/TypoScript',
        'VNC Interactive Image'
    );
    
    if ($typo3Version->getMajorVersion() <= 12) {
        ExtensionManagementUtility::addLLrefForTCAdescr(
            'tx_vncinteractiveimage_domain_model_interactiveimage',
            'EXT:vnc_interactive_image/Resources/Private/Language/locallang_csh_tx_vncinteractiveimage_domain_model_interactiveimage.xlf'
        );
        ExtensionManagementUtility::allowTableOnStandardPages(
            'tx_vncinteractiveimage_domain_model_interactiveimage'
        );

        ExtensionManagementUtility::addLLrefForTCAdescr(
            'tx_vncinteractiveimage_domain_model_mark',
            'EXT:vnc_interactive_image/Resources/Private/Language/locallang_csh_tx_vncinteractiveimage_domain_model_mark.xlf'
        );
        ExtensionManagementUtility::allowTableOnStandardPages(
            'tx_vncinteractiveimage_domain_model_mark'
        );
    }

    if ($typo3Version->getMajorVersion() <= 11) {
        $GLOBALS['TBE_STYLES']['skins']['vnc_interactive_image'] = [];
        $GLOBALS['TBE_STYLES']['skins']['vnc_interactive_image']['name'] = 'BE Styles for InteractiveImage';
        $GLOBALS['TBE_STYLES']['skins']['vnc_interactive_image']['stylesheetDirectories'] = [
            'all' => 'EXT:vnc_interactive_image/Resources/Public/Css/Backend'
        ];
    }
});
