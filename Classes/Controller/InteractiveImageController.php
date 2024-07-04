<?php

namespace Vancado\VncInteractiveImage\Controller;

use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;
use Vancado\VncInteractiveImage\Domain\Repository\InteractiveImageRepository;
use Vancado\VncInteractiveImage\Domain\Model\InteractiveImage;

class InteractiveImageController extends ActionController
{
    /**
     * @var InteractiveImageRepository
     */
    protected $interactiveImageRepository;

    public function injectInteractiveImageRepository(InteractiveImageRepository $interactiveImageRepository): void
    {
        $this->interactiveImageRepository = $interactiveImageRepository;
    }

    public function listAction(): void
    {
        $interactiveImages = $this->interactiveImageRepository->findAll();
        $this->view->assign('interactiveImages', $interactiveImages);
    }

    public function showAction(InteractiveImage $interactiveImage): void
    {
        $this->view->assign('interactiveImage', $interactiveImage);
    }
}
