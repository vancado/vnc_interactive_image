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
    $GLOBALS['TCA']['tt_content']['types']['list']['subtypes_addlist'][$pluginSignature] = '
        tx_vncinteractiveimage_name, tx_vncinteractiveimage_layout, tx_vncinteractiveimage_show_fullscreen,
        tx_vncinteractiveimage_show_title_next_to_marker, tx_vncinteractiveimage_show_zoom, tx_vncinteractiveimage_image,
        tx_vncinteractiveimage_icon_mode, tx_vncinteractiveimage_icon_selection, tx_vncinteractiveimage_icon,
        tx_vncinteractiveimage_icon_formelement, tx_vncinteractiveimage_setmarker, tx_vncinteractiveimage_marks
    ';

    $GLOBALS['TCA']['tt_content']['columns']['tx_vncinteractiveimage_layout'] = [
        'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_interactiveimage.layout',
        'onChange' => 'reload',
        'config' => [
            'type' => 'select',
            'renderType' => 'selectSingle',
            'items' => [
                ['Info Box', 'infoBox'],
                ['Popover', 'popover'],
            ],
            'default' => 'infoBox',
        ],
    ];

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
            'allowed' => 'jpg,jpeg,png,svg',
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
            ],
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

    $GLOBALS['TCA']['tt_content']['columns']['tx_vncinteractiveimage_icon_selection'] = [
        'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_interactiveimage.icon_selection',
        'displayCond' => 'FIELD:tx_vncinteractiveimage_icon_mode:=:same',
        'onChange' => 'reload',
        'config' => [
            'type' => 'radio',
            'items' => [
                ['Upload Icon', 'upload'],
                ['Select from Icon Formelement', 'formelement']
            ]
        ]
    ];

    $GLOBALS['TCA']['tt_content']['columns']['tx_vncinteractiveimage_icon'] = [
        'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_interactiveimage.icon',
        'displayCond' => [
            'AND' => [
                'FIELD:tx_vncinteractiveimage_icon_mode:=:same',
                'FIELD:tx_vncinteractiveimage_icon_selection:=:upload'
            ]
        ],
        'config' => [
            'type' => 'file',
            'appearance' => [
                'createNewRelationLinkTitle' => 'LLL:EXT:core/Resources/Private/Language/locallang_core.xlf:media.addFileReference'
            ],
            'minitems' => 0,
            'maxitems' => 1,
            'allowed' => 'gif,svg',

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
                            'type' => 'passthrough',
                        ],
                    ],
                ],
            ],
        ],
    ];

    $GLOBALS['TCA']['tt_content']['columns']['tx_vncinteractiveimage_icon_formelement'] = [
        'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_interactiveimage.tx_vncinteractiveimage_icon_formelement',
        'displayCond' => [
            'AND' => [
                'FIELD:tx_vncinteractiveimage_icon_mode:=:same',
                'FIELD:tx_vncinteractiveimage_icon_selection:=:formelement'
            ]
        ],
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

    $GLOBALS['TCA']['tt_content']['columns']['tx_vncinteractiveimage_show_fullscreen'] = [
        'exclude' => 1,
        'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_interactiveimage.show_fullscreen',
        'config' => [
            'type' => 'check',
            'items' => [
                // label, value
                ['LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_interactiveimage.label.show', ''],
            ],
        ]
    ];

    $GLOBALS['TCA']['tt_content']['columns']['tx_vncinteractiveimage_show_title_next_to_marker'] = [
        'exclude' => 1,
        'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_interactiveimage.show_title_next_to_marker',
        'config' => [
            'type' => 'check',
            'items' => [
                // label, value
                ['LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_interactiveimage.label.show', ''],
            ],
        ]
    ];

    $GLOBALS['TCA']['tt_content']['columns']['tx_vncinteractiveimage_show_zoom'] = [
        'exclude' => 1,
        'label' => 'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_interactiveimage.show_zoom',
        'config' => [
            'type' => 'check',
            'items' => [
                // label, value
                ['LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vncinteractiveimage_domain_model_interactiveimage.label.show', ''],
            ],
        ]
    ];

    $GLOBALS['TCA']['tt_content']['types']['list']['subtypes_excludelist'][$pluginSignature] .= ',frame_layout,frame_options,background_color_class,background_image,background_image_options';
});
