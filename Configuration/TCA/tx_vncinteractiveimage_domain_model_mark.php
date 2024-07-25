<?php

return [
    'ctrl' => [
        'title' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_mark',
        'label' => 'title',
        'tstamp' => 'tstamp',
        'crdate' => 'crdate',
        'cruser_id' => 'cruser_id',
        'versioningWS' => 2,
        'origUid' => 't3_origuid',
        'languageField' => 'sys_language_uid',
        'transOrigPointerField' => 'l10n_parent',
        'transOrigDiffSourceField' => 'l10n_diffsource',
        'delete' => 'deleted',
        'enablecolumns' => [
            'disabled' => 'hidden',
            'starttime' => 'starttime',
            'endtime' => 'endtime',
        ],
        'sortby' => 'sorting',
        'default_sortby' => 'ORDER BY sorting',
        'searchFields' => 'title, bodytext',
        'iconfile' => 'EXT:vnc_interactive_image/Resources/Public/Icons/tx_vncinteractiveimage_domain_model_mark.gif'
    ],
    'types' => [
        '1' => ['showitem' => 'title, bodytext, icon_selection, icon, icon_formelement, position_x, position_y']
    ],
    'columns' => [
        'title' => [
            'exclude' => 0,
            'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_mark.title',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'trim'
            ]
        ],
        'bodytext' => [
            'exclude' => 0,
            'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_mark.bodytext',
            'config' => [
                'type' => 'text',
                'cols' => 40,
                'rows' => 15,
                'eval' => 'trim',
                'enableRichtext' => true,
            ]
        ],
        'icon_selection' => [
            'exclude' => 0,
            'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_mark.icon_selection',
            'displayCond' => 'USER:Vancado\\VncInteractiveImage\\Condition\\IconModeCondition->checkIconMode',
            'onChange' => 'reload',
            'config' => [
                'type' => 'radio',
                'items' => [
                    ['Upload Icon', 'upload'],
                    ['Select from Icon Formelement', 'formelement']
                ]
            ]
        ],
        'icon' => [
            'exclude' => 0,
            'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_mark.icon',
            'displayCond' => [
                'AND' => [
                    'USER:Vancado\\VncInteractiveImage\\Condition\\IconModeCondition->checkIconMode',
                    'FIELD:icon_selection:=:upload'
                ]
            ],
            'config' => \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::getFileFieldTCAConfig('icon')
        ],
        'icon_formelement' => [
            'exclude' => 0,
            'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_mark.icon_formelement',
            'displayCond' => [
                'AND' => [
                    'USER:Vancado\\VncInteractiveImage\\Condition\\IconModeCondition->checkIconMode',
                    'FIELD:icon_selection:=:formelement'
                ]
            ],
            'config' => [
                'type' => 'input',
                'renderType' => 'selectIcon',
                'iconset-type' => 'nucleo',
                'iconset-path' => \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::extPath('vnc_icon_formelement') . 'Resources/Public/Libraries/Nucleo',
            ]
        ],
        'position_x' => [
            'exclude' => 0,
            'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_mark.position_x',
            'config' => [
                'range' => [
                    'lower' => 0,
                    'upper' => 1
                ],
                'type' => 'input',
                'size' => 4,
                'eval' => 'double2'
            ]
        ],
        'position_y' => [
            'exclude' => 0,
            'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_mark.position_y',
            'config' => [
                'range' => [
                    'lower' => 0,
                    'upper' => 1
                ],
                'type' => 'input',
                'size' => 4,
                'eval' => 'double2'
            ]
        ],
        'interactive_image' => [
            'config' => [
                'type' => 'passthrough'
            ]
        ]
    ]
];
