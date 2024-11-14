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
    protected $txVncinteractiveimageName = '';

    /**
     * @var FileReference
     */
    protected $txVncinteractiveimageImage = null;

    /**
     * @var string
     */
    protected $txVncinteractiveimageIconMode = '';

    /**
     * @var FileReference
     */
    protected $txVncinteractiveimageIcon = null;

    /**
     * @var string
     */
    protected $txVncinteractiveimageIconFormelement = '';

    /**
     * @var string
     */
    protected $txVncinteractiveimageIconSelection = '';

    /**
     * @var ObjectStorage<\Vancado\VncInteractiveImage\Domain\Model\Mark>
     * @TYPO3\CMS\Extbase\Annotation\ORM\Cascade("remove")
     */
    protected $txVncinteractiveimageMarks;

    /**
     * @var string
     */
    protected $txVncinteractiveimageLayout = '';
    
    /**
     * @var bool
     */
    protected $txVncinteractiveimageShowFullscreen = false;

    /**
     * @var bool
     */
    protected $txVncinteractiveimageShowTitleNextToMarker = false;

    /**
     * @var bool
     */
    protected $txVncinteractiveimageShowZoom = false;

    public function __construct()
    {
        $this->txVncinteractiveimageMarks = new ObjectStorage();
    }

    public function getTxVncinteractiveimageName(): string
    {
        return $this->txVncinteractiveimageName;
    }

    public function setTxVncinteractiveimageName(string $txVncinteractiveimageName): void
    {
        $this->txVncinteractiveimageName = $txVncinteractiveimageName;
    }

    public function getTxVncinteractiveimageImage(): ?FileReference
    {
        return $this->txVncinteractiveimageImage;
    }

    public function setTxVncinteractiveimageImage(?FileReference $txVncinteractiveimageImage): void
    {
        $this->txVncinteractiveimageImage = $txVncinteractiveimageImage;
    }

    public function getTxVncinteractiveimageIconMode(): string
    {
        return $this->txVncinteractiveimageIconMode;
    }

    public function setTxVncinteractiveimageIconMode(string $txVncinteractiveimageIconMode): void
    {
        $this->txVncinteractiveimageIconMode = $txVncinteractiveimageIconMode;
    }

    public function getTxVncinteractiveimageIcon(): ?FileReference
    {
        return $this->txVncinteractiveimageIcon;
    }

    public function setTxVncinteractiveimageIcon(?FileReference $txVncinteractiveimageIcon): void
    {
        $this->txVncinteractiveimageIcon = $txVncinteractiveimageIcon;
    }

    public function getTxVncinteractiveimageIconFormelement(): string
    {
        return $this->txVncinteractiveimageIconFormelement;
    }

    public function setTxVncinteractiveimageIconFormelement(string $txVncinteractiveimageIconFormelement): void
    {
        $this->txVncinteractiveimageIconFormelement = $txVncinteractiveimageIconFormelement;
    }

    public function getTxVncinteractiveimageIconSelection(): string
    {
        return $this->txVncinteractiveimageIconSelection;
    }

    public function setTxVncinteractiveimageIconSelection(string $txVncinteractiveimageIconSelection): void
    {
        $this->txVncinteractiveimageIconSelection = $txVncinteractiveimageIconSelection;
    }

    public function getTxVncinteractiveimageMarks(): ObjectStorage
    {
        return $this->txVncinteractiveimageMarks;
    }

    public function setTxVncinteractiveimageMarks(ObjectStorage $txVncinteractiveimageMarks): void
    {
        $this->txVncinteractiveimageMarks = $txVncinteractiveimageMarks;
    }

    public function getTxVncinteractiveimageLayout(): string
    {
        return $this->txVncinteractiveimageLayout;
    }

    public function setTxVncinteractiveimageLayout(string $txVncinteractiveimageLayout): void
    {
        $this->txVncinteractiveimageLayout = $txVncinteractiveimageLayout;
    }

    public function isTxVncinteractiveimageShowFullscreen(): bool
    {
        return $this->txVncinteractiveimageShowFullscreen;
    }

    public function setTxVncinteractiveimageShowFullscreen(bool $txVncinteractiveimageShowFullscreen): void
    {
        $this->txVncinteractiveimageShowFullscreen = $txVncinteractiveimageShowFullscreen;
    }

    public function isTxVncinteractiveimageShowTitleNextToMarker(): bool
    {
        return $this->txVncinteractiveimageShowTitleNextToMarker;
    }

    public function setTxVncinteractiveimageShowTitleNextToMarker(bool $txVncinteractiveimageShowTitleNextToMarker): void
    {
        $this->txVncinteractiveimageShowTitleNextToMarker = $txVncinteractiveimageShowTitleNextToMarker;
    }

    public function isTxVncinteractiveimageShowZoom(): bool
    {
        return $this->txVncinteractiveimageShowZoom;
    }

    public function setTxVncinteractiveimageShowZoom(bool $txVncinteractiveimageShowZoom): void
    {
        $this->txVncinteractiveimageShowZoom = $txVncinteractiveimageShowZoom;
    }
}
