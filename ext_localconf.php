<?php

defined('TYPO3') || die();

use TYPO3\CMS\Extbase\Utility\ExtensionUtility;
use Vancado\VncInteractiveImage\Controller\InteractiveImageController;
use Vancado\VncInteractiveImage\Form\Element\SetMarker;

call_user_func(function () {
    
    ExtensionUtility::registerPlugin(
        'VncInteractiveImage',
        'Vncinteractive',
        'Vancado Interactive Image'
    );

    ExtensionUtility::configurePlugin(
        'VncInteractiveImage',
        'Vncinteractive',
        [
            InteractiveImageController::class => 'show'
        ],
        // non-cacheable actions
        [
            InteractiveImageController::class => 'show'
        ]
    );

    // wizards
    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPageTSConfig(
        'mod {
            wizards.newContentElement.wizardItems.plugins {
                elements {
                    vncinteractiveimage {
                        iconIdentifier = vnc_interactive_image-plugin-vncinteractiveimage
                        title = LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vnc_interactive_image_vncinteractiveimage.name
                        description = LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vnc_interactive_image_vncinteractiveimage.description
                        tt_content_defValues {
                            CType = list
                            list_type = vncinteractiveimage_vncinteractive
                        }
                    }
                }
                show = *
            }
       }'
    );

    $iconRegistry = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\TYPO3\CMS\Core\Imaging\IconRegistry::class);
    $iconRegistry->registerIcon(
        'vnc_interactive_image-plugin-vncinteractiveimage',
        \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
        ['source' => 'EXT:vnc_interactive_image/Resources/Public/Icons/Extension.svg']
    );

    /**
     * Register nodes
     */
    $GLOBALS['TYPO3_CONF_VARS']['SYS']['formEngine']['nodeRegistry'][1720051163] = [
        'nodeName' => 'setMarker',
        'priority' => 40,
        'class' => SetMarker::class,
    ];
    
    /**
     * Register hooks
     */
    $GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['t3lib/class.t3lib_pagerenderer.php']['render-preProcess'][] = \Vancado\VncInteractiveImage\Hook\PageRendererRenderPreProcess::class . '->addJavaScript';

    /**
     * Add backend CSS
     */
    $GLOBALS['TYPO3_CONF_VARS']['BE']['stylesheets']['vnc_interactive_image'] = 'EXT:vnc_interactive_image/Resources/Public/Css/Backend/';
});