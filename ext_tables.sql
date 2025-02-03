CREATE TABLE tx_vncinteractiveimage_domain_model_mark
(
    uid               int(11) NOT NULL auto_increment,
    pid               int(11) DEFAULT '0' NOT NULL,
    title             varchar(255) DEFAULT ''  NOT NULL,
    title_position    varchar(8)   DEFAULT 'right'  NOT NULL,
    bodytext          text,
    icon              int(11) DEFAULT '0' NOT NULL,
    icon_formelement  varchar(255) DEFAULT ''  NOT NULL,
    icon_selection    varchar(255) DEFAULT ''  NOT NULL,
    image             int(11) DEFAULT '0' NOT NULL,
    link              varchar(255) DEFAULT ''  NOT NULL,
    position_x        float        DEFAULT '0' NOT NULL,
    position_y        float        DEFAULT '0' NOT NULL,
    sorting           int(11) DEFAULT '0' NOT NULL,
    interactive_image int(11) DEFAULT '0' NOT NULL,
    show_zoom         tinyint(4) unsigned DEFAULT '0' NOT NULL,
    PRIMARY KEY (uid)
);

CREATE TABLE tt_content
(
    tx_vncinteractiveimage_name                      varchar(255) DEFAULT '' NOT NULL,
    tx_vncinteractiveimage_image                     int(11) DEFAULT '0' NOT NULL,
    tx_vncinteractiveimage_icon_mode                 varchar(255) DEFAULT '' NOT NULL,
    tx_vncinteractiveimage_icon                      int(11) DEFAULT '0' NOT NULL,
    tx_vncinteractiveimage_icon_formelement          varchar(255) DEFAULT '' NOT NULL,
    tx_vncinteractiveimage_icon_selection            varchar(255) DEFAULT '' NOT NULL,
    tx_vncinteractiveimage_marks                     int(11) DEFAULT '0' NOT NULL,
    tx_vncinteractiveimage_setmarker                 int(11) DEFAULT '0' NOT NULL,
    tx_vncinteractiveimage_layout                    varchar(255) DEFAULT '' NOT NULL,
    tx_vncinteractiveimage_container_layout          varchar(255) DEFAULT 'tabs' NOT NULL,
    tx_vncinteractiveimage_show_fullscreen           tinyint(4) unsigned DEFAULT '0' NOT NULL,
    tx_vncinteractiveimage_show_title_next_to_marker tinyint(4) unsigned DEFAULT '0' NOT NULL,
    tx_vncinteractiveimage_show_zoom                 tinyint(4) unsigned DEFAULT '0' NOT NULL,
);
