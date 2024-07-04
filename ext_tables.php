<?php

defined('TYPO3') or die();

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

call_user_func(function () {
    ExtensionManagementUtility::addStaticFile(
        'vnc_interactive_image',
        'Configuration/TypoScript',
        'VNC Interactive Image'
    );
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
});
