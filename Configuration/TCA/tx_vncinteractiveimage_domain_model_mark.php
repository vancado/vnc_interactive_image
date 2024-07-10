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
        'searchFields' => 'title, bodytext',
        'iconfile' => 'EXT:vnc_interactive_image/Resources/Public/Icons/tx_vncinteractiveimage_domain_model_mark.gif'
    ],
    'types' => [
        '1' => ['showitem' => 'title, bodytext, icon, position_x, position_y']
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
        'icon' => [
            'exclude' => 0,
            'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_mark.icon',
            'displayCond' => 'USER:Vancado\\VncInteractiveImage\\Condition\\IconModeCondition->checkIconMode',
            'config' => \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::getFileFieldTCAConfig('icon')
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
