<?php

declare(strict_types=1);

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Information\Typo3Version;
use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

function getNumberField(): array
{
    $typo3Version = GeneralUtility::makeInstance(Typo3Version::class);
    if ($typo3Version->getMajorVersion() >= 12) {
        return [
            'range' => [
                'lower' => 0,
                'upper' => 100
            ],
            'type' => 'number',
            'format' => 'decimal',
            'size' => 5,
            'eval' => 'double2',
        ];
    } else {
        return [
            'range' => [
                'lower' => 0,
                'upper' => 100
            ],
            'type' => 'input',
            'format' => 'decimal',
            'size' => 5,
            'eval' => 'double2',
        ];
    }
}

function getConfigForVncInteractiveImageMarkIcon(): array{
    $typo3Version = GeneralUtility::makeInstance(Typo3Version::class);

    if ($typo3Version->getMajorVersion() >= 12) {
        return \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::getFileFieldTCAConfig('icon', [
            'overrideChildTca' => [
                'columns' => [
                    'description' => [
                        'config' => [
                            'type' => 'passthrough',
                        ]
                    ],
                    'alternative' => [
                        'config' => [
                            'type' => 'passthrough',
                        ]
                    ],
                    'link' => [
                        'config' => [
                            'type' => 'passthrough',
                        ]
                    ],
                    'title' => [
                        'config' => [
                            'type' => 'passthrough',
                        ]
                    ],
                    'crop' => [
                        'config' => [
                            'type' => 'passthrough'
                        ]
                    ]
                ]
            ]
        ]);
    } else {
        return ExtensionManagementUtility::getFileFieldTCAConfig('icon', [
            'appearance' => [
                'createNewRelationLinkTitle' => 'LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:images.addFileReference',
                'fileByUrlAllowed' => false,
            ],
            'overrideChildTca' => [
                'columns' => [
                    'description' => [
                        'config' => [
                            'type' => 'passthrough',
                        ]
                    ],
                    'alternative' => [
                        'config' => [
                            'type' => 'passthrough',
                        ]
                    ],
                    'link' => [
                        'config' => [
                            'type' => 'passthrough',
                        ]
                    ],
                    'title' => [
                        'config' => [
                            'type' => 'passthrough',
                        ]
                    ],
                ]
            ],
        ], 'jpg,jpeg,png,svg');
    }
}

function getConfigForVncInteractiveImageMarkImage(): array{
    $typo3Version = GeneralUtility::makeInstance(Typo3Version::class);

    if ($typo3Version->getMajorVersion() >= 12) {
        return [
            'type' => 'inline',
            'foreign_table' => 'sys_file_reference',
            'foreign_field' => 'uid_foreign',
            'foreign_sortby' => 'sorting_foreign',
            'foreign_label' => 'uid_local',
            'foreign_selector' => 'uid_local',
            'foreign_selector_fieldTcaOverride' => [
                'config' => [
                    'appearance' => [
                        'elementBrowserType' => 'file',
                        'elementBrowserAllowed' => 'jpg,jpeg,png,svg'
                    ]
                ]
            ],
            'filter' => [
                [
                    'userFunc' => \TYPO3\CMS\Core\Resource\Filter\FileExtensionFilter::class . '->filterInlineChildren',
                    'parameters' => [
                        'allowedFileExtensions' => 'jpg,jpeg,png,svg'
                    ]
                ]
            ],
            'appearance' => [
                'useSortable' => true,
                'headerThumbnail' => [
                    'field' => 'uid_local',
                    'width' => '45',
                    'height' => '45'
                ],
                'enabledControls' => [
                    'info' => true,
                    'new' => false,
                    'dragdrop' => true,
                    'sort' => true,
                    'hide' => true,
                    'delete' => true
                ],
                'fileUploadAllowed' => true
            ],
            'maxitems' => 1,
            'minitems' => 0,
            'overrideChildTca' => [
                'columns' => [
                    'description' => [
                        'config' => [
                            'type' => 'passthrough',
                        ]
                    ],
                    'alternative' => [
                        'config' => [
                            'type' => 'passthrough',
                        ]
                    ],
                    'link' => [
                        'config' => [
                            'type' => 'passthrough',
                        ]
                    ],
                    'title' => [
                        'config' => [
                            'type' => 'passthrough',
                        ]
                    ],
                    'crop' => [
                        'config' => [
                            'cropVariants' => [
                                'default' => [
                                    'title' => 'Default',
                                    'disabled' => false,
                                    'allowedAspectRatios' => [
                                        '3:1' => [
                                            'title' => 'Ultraweit 3:1',
                                            'value' => 3.0
                                        ],
                                        '5:2' => [
                                            'title' => 'Weit 5:2',
                                            'value' => 2.5
                                        ],
                                        '2:0' => [
                                            'title' => 'Univisium 2:1',
                                            'value' => 2.0
                                        ],
                                        '16:9' => [
                                            'title' => '16:9 Breitbild',
                                            'value' => 1.77
                                        ],
                                        '2:3' => [
                                            'title' => '2:3 Hochkant',
                                            'value' => 0.66
                                        ],
                                        '4:3' => [
                                            'title' => '4:3 Klassischer Fernseher',
                                            'value' => 1.33
                                        ],
                                        '5:4' => [
                                            'title' => '5:4 klassisches Monitorformat',
                                            'value' => 1.25
                                        ],
                                        '1:1' => [
                                            'title' => '1:1 Quadrat',
                                            'value' => 1.0
                                        ],
                                        'NaN' => [
                                            'title' => 'LLL:EXT:core/Resources/Private/Language/locallang_wizards.xlf:imwizard.ratio.free',
                                            'value' => 0.0
                                        ],
                                    ]
                                ],
                            ],
                        ]
                    ]
                ]
            ]
        ];
    } else {
        return ExtensionManagementUtility::getFileFieldTCAConfig('image', [
            'appearance' => [
                'createNewRelationLinkTitle' => 'LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:images.addFileReference',
                'fileByUrlAllowed' => false,
            ],
            'overrideChildTca' => [
                'columns' => [
                    'description' => [
                        'config' => [
                            'type' => 'passthrough',
                        ]
                    ],
                    'alternative' => [
                        'config' => [
                            'type' => 'passthrough',
                        ]
                    ],
                    'link' => [
                        'config' => [
                            'type' => 'passthrough',
                        ]
                    ],
                    'title' => [
                        'config' => [
                            'type' => 'passthrough',
                        ]
                    ],
                    'image' => [
                        'config' => [
                            'cropVariants' => [
                                'default' => [
                                    'title' => 'Default',
                                    'disabled' => false,
                                    'allowedAspectRatios' => [
                                        '3:1' => [
                                            'title' => 'Ultraweit 3:1',
                                            'value' => 3.0
                                        ],
                                        '5:2' => [
                                            'title' => 'Weit 5:2',
                                            'value' => 2.5
                                        ],
                                        '2:0' => [
                                            'title' => 'Univisium 2:1',
                                            'value' => 2.0
                                        ],
                                        '16:9' => [
                                            'title' => '16:9 Breitbild',
                                            'value' => 1.77
                                        ],
                                        '2:3' => [
                                            'title' => '2:3 Hochkant',
                                            'value' => 0.66
                                        ],
                                        '4:3' => [
                                            'title' => '4:3 Klassischer Fernseher',
                                            'value' => 1.33
                                        ],
                                        '5:4' => [
                                            'title' => '5:4 klassisches Monitorformat',
                                            'value' => 1.25
                                        ],
                                        '1:1' => [
                                            'title' => '1:1 Quadrat',
                                            'value' => 1.0
                                        ],
                                        'NaN' => [
                                            'title' => 'LLL:EXT:core/Resources/Private/Language/locallang_wizards.xlf:imwizard.ratio.free',
                                            'value' => 0.0
                                        ],
                                    ]
                                ],
                            ],
                        ]
                    ]
                ]
            ],
        ], 'jpg,jpeg,png,svg');
    }
}

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
        'iconfile' => 'EXT:vnc_interactive_image/Resources/Public/Icons/tx_vncinteractiveimage_domain_model_mark.svg'
    ],
    'types' => [
        '1' => ['showitem' => 'position_x, position_y, title, title_position, image, bodytext, link, icon_selection, icon, icon_formelement']
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
        'title_position' => [
            'exclude' => 0,
            'displayCond' => 'USER:Vancado\\VncInteractiveImage\\Condition\\MarkerTitleCondition->isTitleEnabled',
            'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_mark.title_position',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => [
                    [
                        'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_mark.title_position.left',
                        'left',
                    ],
                    [
                        'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_mark.title_position.right',
                        'right',
                    ],
                ],
                'default' => 'right',
            ],
        ],
        'image' => [
            'exclude' => 0,
            'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_mark.image',
            'config' => getConfigForVncInteractiveImageMarkImage(),
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
        'link' => [
            'exclude' => 0,
            'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_mark.link',
            'config' => [
                'type' => 'input',
                'renderType' => 'inputLink',
                'softref' => 'typolink'
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
            'config' => getConfigForVncInteractiveImageMarkIcon(),
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
            'config' => getNumberField(),
        ],
        'position_y' => [
            'exclude' => 0,
            'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_mark.position_y',
            'config' => getNumberField(),
        ],
        'interactive_image' => [
            'config' => [
                'type' => 'passthrough'
            ]
        ],
    ]
];
