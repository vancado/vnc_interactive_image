<?php

namespace Vancado\VncInteractiveImage\Domain\Model;

use TYPO3\CMS\Extbase\DomainObject\AbstractEntity;
use TYPO3\CMS\Extbase\Domain\Model\FileReference;

class Mark extends AbstractEntity
{
    /**
     * @var int
     */
    protected $hidden = 0;

    /**
     * @var int
     */
    protected $starttime = 0;

    /**
     * @var int
     */
    protected $endtime = 0;

    /**
     * @var string
     */
    protected $title = '';

    /**
     * @var string
     */
    protected $titlePosition = '';

    /**
     * @var string
     */
    protected $bodytext = '';

    /**
     * @var FileReference
     */
    protected $icon = null;

    /**
     * @var string
     */
    protected $iconFormelement = '';

    /**
     * @var string
     */
    protected $iconSelection = '';

    /**
     * @var FileReference
     */
    protected $image = null;

    /**
     * @var string
     */
    protected $link = '';

    /**
     * @var float
     */
    protected $positionX = 0.0;

    /**
     * @var float
     */
    protected $positionY = 0.0;

    public function getHidden(): int
    {
        return $this->hidden;
    }

    public function getStarttime(): int
    {
        return $this->starttime;
    }

    public function getEndtime(): int
    {
        return $this->endtime;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    public function getTitlePosition(): string
    {
        return $this->titlePosition;
    }

    public function setTitlePosition(string $titlePosition): void
    {
        $this->titlePosition = $titlePosition;
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

    public function getIconFormelement(): string
    {
        return $this->iconFormelement;
    }

    public function setIconFormelement(string $iconFormelement): void
    {
        $this->iconFormelement = $iconFormelement;
    }

    public function getIconSelection(): string
    {
        return $this->iconSelection;
    }

    public function setIconSelection(string $iconSelection): void
    {
        $this->iconSelection = $iconSelection;
    }

    public function getImage(): ?FileReference
    {
        return $this->image;
    }

    public function setImage(FileReference $image): void
    {
        $this->image = $image;
    }

    public function getLink(): string
    {
        return $this->link;
    }

    public function setLink(string $link): void
    {
        $this->link = $link;
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
