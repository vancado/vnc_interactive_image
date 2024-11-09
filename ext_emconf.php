<?php

$EM_CONF['vnc_interactive_image'] = [
    'title' => 'Vancado Interactive Image',
    'description' => 'An extension to create interactive images with icons and markers.',
    'category' => 'plugin',
    'author' => 'Sajan Telrejah',
    'author_email' => 'Sajan.Telrejah@Vancado.de',
    'state' => 'stable',
    'clearCacheOnLoad' => 1,
    'version' => '12.5.5',
    'constraints' => [
        'depends' => [
            'typo3' => '11.5.0-12.4.99',
            'vnc_icon_formelement' => '12.0.0-12.4.99'
        ],
        'conflicts' => [],
        'suggests' => [],
    ],
];
