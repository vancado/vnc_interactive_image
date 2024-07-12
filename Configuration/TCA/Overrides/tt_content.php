<?php

defined('TYPO3') || die();

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

call_user_func(function () {
    $pluginSignature = 'vncinteractiveimage_vncinteractive';

    ExtensionManagementUtility::addPlugin(
        [
            'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vnc_interactive_image_vncinteractiveimage.name',
            $pluginSignature,
            'EXT:vnc_interactive_image/Resources/Public/Icons/Extension.svg'
        ],
        'list_type',
        'vnc_interactive_image'
    );

    $GLOBALS['TCA']['tt_content']['types']['list']['subtypes_excludelist'][$pluginSignature] = 'pages,layout,select_key,recursive';
    $GLOBALS['TCA']['tt_content']['types']['list']['subtypes_addlist'][$pluginSignature] = 'tx_vncinteractiveimage_name, tx_vncinteractiveimage_image, tx_vncinteractiveimage_icon_mode, tx_vncinteractiveimage_icon, tx_vncinteractiveimage_icon_formelement, tx_vncinteractiveimage_setmarker, tx_vncinteractiveimage_marks';

    $GLOBALS['TCA']['tt_content']['columns']['tx_vncinteractiveimage_name'] = [
        'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_interactiveimage.name',
        'config' => [
            'type' => 'input',
            'size' => 30,
            'eval' => 'trim'
        ]
    ];

    $GLOBALS['TCA']['tt_content']['columns']['tx_vncinteractiveimage_image'] = [
        'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_interactiveimage.image',
        'config' => [
            'type' => 'file',
            'appearance' => [
                'createNewRelationLinkTitle' => 'LLL:EXT:core/Resources/Private/Language/locallang_core.xlf:media.addFileReference'
            ],
            'minitems' => 0,
            'maxitems' => 1,
            'allowed' => 'jpg,jpeg,png,svg'
        ]
    ];

    $GLOBALS['TCA']['tt_content']['columns']['tx_vncinteractiveimage_icon_mode'] = [
        'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_interactiveimage.icon_mode',
        'onChange' => 'reload',
        'config' => [
            'type' => 'select',
            'renderType' => 'selectSingle',
            'items' => [
                ['same icon', 'same'],
                ['different icons', 'different'],
                ['numbers', 'numbers']
            ]
        ]
    ];

    $GLOBALS['TCA']['tt_content']['columns']['tx_vncinteractiveimage_icon'] = [
        'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_interactiveimage.icon',
        'displayCond' => 'FIELD:tx_vncinteractiveimage_icon_mode:=:same',
        'config' => [
            'type' => 'file',
            'appearance' => [
                'createNewRelationLinkTitle' => 'LLL:EXT:core/Resources/Private/Language/locallang_core.xlf:media.addFileReference'
            ],
            'minitems' => 0,
            'maxitems' => 1,
            'allowed' => 'svg'
        ]
    ];

    $GLOBALS['TCA']['tt_content']['columns']['tx_vncinteractiveimage_icon_formelement'] = [
        'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_interactiveimage.tx_vncinteractiveimage_icon_formelement',
        'displayCond' => 'FIELD:tx_vncinteractiveimage_icon_mode:=:same',
        'config' => [
            'type' => 'input',
            'renderType' => 'selectIcon',
            'iconset-type' => 'nucleo',
            'iconset-path' => \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::extPath('vnc_icon_formelement') . 'Resources/Public/Libraries/Nucleo',
        ]
    ];

    $GLOBALS['TCA']['tt_content']['columns']['tx_vncinteractiveimage_marks'] = [
        'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_interactiveimage.marks',
        'config' => [
            'type' => 'inline',
            'foreign_table' => 'tx_vncinteractiveimage_domain_model_mark',
            'foreign_field' => 'interactive_image',
            'maxitems' => 9999,
            'appearance' => [
                'collapseAll' => 1,
                'levelLinksPosition' => 'top',
                'showSynchronizationLink' => 1,
                'showPossibleLocalizationRecords' => 1,
                'showAllLocalizationLink' => 1,
                'useSortable' => true
            ],
            'behaviour' => [
                'sortable' => 'sorting'
            ]
        ]
    ];

    $GLOBALS['TCA']['tt_content']['columns']['tx_vncinteractiveimage_setmarker'] = [
        'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_interactiveimage.set_marker',
        'config' => [
            'type' => 'user',
            'default' => '',
            'renderType' => 'setMarker',
            'parameters' => [],
        ],
    ];
});
