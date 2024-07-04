<?php

namespace Vancado\VncInteractiveImage\Domain\Model;

use TYPO3\CMS\Extbase\DomainObject\AbstractEntity;
use TYPO3\CMS\Extbase\Domain\Model\FileReference;

class Mark extends AbstractEntity
{
    /**
     * @var string
     */
    protected $text = '';

    /**
     * @var FileReference
     */
    protected $icon = null;

    /**
     * @var float
     */
    protected $positionX = 0.0;

    /**
     * @var float
     */
    protected $positionY = 0.0;

    public function getText(): string
    {
        return $this->text;
    }

    public function setText(string $text): void
    {
        $this->text = $text;
    }

    public function getIcon(): ?FileReference
    {
        return $this->icon;
    }

    public function setIcon(FileReference $icon): void
    {
        $this->icon = $icon;
    }

    public function getPositionX(): float
    {
        return $this->positionX;
    }

    public function setPositionX(float $positionX): void
    {
        $this->positionX = $positionX;
    }

    public function getPositionY(): float
    {
        return $this->positionY;
    }

    public function setPositionY(float $positionY): void
    {
        $this->positionY = $positionY;
    }
}
