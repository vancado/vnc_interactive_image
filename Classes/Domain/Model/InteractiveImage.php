<?php

namespace Vancado\VncInteractiveImage\Domain\Model;

use TYPO3\CMS\Extbase\DomainObject\AbstractEntity;
use TYPO3\CMS\Extbase\Persistence\ObjectStorage;
use TYPO3\CMS\Extbase\Domain\Model\FileReference;

class InteractiveImage extends AbstractEntity
{
    /**
     * @var string
     */
    protected $name = '';

    /**
     * @var FileReference
     */
    protected $image = null;

    /**
     * @var string
     */
    protected $iconMode = '';

    /**
     * @var FileReference
     */
    protected $icon = null;

    /**
     * @var ObjectStorage<\Vnc\InteractiveImage\Domain\Model\Mark>
     * @cascade remove
     */
    protected $marks = null;

    public function __construct()
    {
        $this->marks = new ObjectStorage();
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getImage(): ?FileReference
    {
        return $this->image;
    }

    public function setImage(FileReference $image): void
    {
        $this->image = $image;
    }

    public function getIconMode(): string
    {
        return $this->iconMode;
    }

    public function setIconMode(string $iconMode): void
    {
        $this->iconMode = $iconMode;
    }

    public function getIcon(): ?FileReference
    {
        return $this->icon;
    }

    public function setIcon(FileReference $icon): void
    {
        $this->icon = $icon;
    }

    public function getMarks(): ObjectStorage
    {
        return $this->marks;
    }

    public function setMarks(ObjectStorage $marks): void
    {
        $this->marks = $marks;
    }
}
