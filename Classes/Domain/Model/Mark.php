<?php

namespace Vancado\VncInteractiveImage\Domain\Model;

use TYPO3\CMS\Extbase\DomainObject\AbstractEntity;
use TYPO3\CMS\Extbase\Domain\Model\FileReference;

class Mark extends AbstractEntity
{
    /**
     * @var string
     */
    protected $title = '';

    /**
     * @var string
     */
    protected $bodytext = '';

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

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    public function getBodytext(): string
    {
        return $this->bodytext;
    }

    public function setBodytext(string $bodytext): void
    {
        $this->bodytext = $bodytext;
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
