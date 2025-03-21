<?php

$EM_CONF['vnc_interactive_image'] = [
    'title' => 'Vancado Interactive Image',
    'description' => 'An extension to create interactive images with icons and markers.',
    'category' => 'plugin',
    'author' => 'Sajan Telrejah, Christian Müller, Johannes Böttcher',
    'author_email' => 'Sajan.Telrejah@Vancado.de, christian.mueller@vancado.de, johannes.boettcher@vancado.de',
    'state' => 'stable',
    'clearCacheOnLoad' => 1,
    'version' => '13.0.6',
    'constraints' => [
        'depends' => [
            'typo3' => '11.5.0-13.4.99',
            'vnc_icon_formelement' => '12.0.0-13.4.99'
        ],
        'conflicts' => [],
        'suggests' => [],
    ],
];
