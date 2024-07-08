CREATE TABLE tx_vncinteractiveimage_domain_model_interactiveimage
(
    uid            int(11) NOT NULL auto_increment,
    pid            int(11) DEFAULT '0' NOT NULL,
    name           varchar(255) DEFAULT '' NOT NULL,
    image          int(11) DEFAULT '0' NOT NULL,
    icon_mode      varchar(255) DEFAULT '' NOT NULL,
    icon           int(11) DEFAULT '0' NOT NULL,
    different_icon int(11) DEFAULT '0' NOT NULL,
    PRIMARY KEY (uid)
);

CREATE TABLE tx_vncinteractiveimage_domain_model_mark
(
    uid               int(11) NOT NULL auto_increment,
    pid               int(11) DEFAULT '0' NOT NULL,
    title             varchar(255) DEFAULT '' NOT NULL,
    bodytext          text,
    icon              int(11) DEFAULT '0' NOT NULL,
    position_x        float        DEFAULT '0' NOT NULL,
    position_y        float        DEFAULT '0' NOT NULL,
    interactive_image int(11) DEFAULT '0' NOT NULL,
    PRIMARY KEY (uid)
);

CREATE TABLE tt_content
(
    tx_vncinteractiveimage_name           varchar(255) DEFAULT '' NOT NULL,
    tx_vncinteractiveimage_image          int(11) DEFAULT '0' NOT NULL,
    tx_vncinteractiveimage_icon_mode      varchar(255) DEFAULT '' NOT NULL,
    tx_vncinteractiveimage_icon           int(11) DEFAULT '0' NOT NULL,
    tx_vncinteractiveimage_different_icon int(11) DEFAULT '0' NOT NULL,
    tx_vncinteractiveimage_marks          int(11) DEFAULT '0' NOT NULL,
    tx_vncinteractiveimage_setmarker      int(11) DEFAULT '0' NOT NULL
);
