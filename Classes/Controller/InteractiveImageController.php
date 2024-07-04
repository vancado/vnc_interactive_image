<?php

namespace Vancado\VncInteractiveImage\Controller;

use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;
use Vancado\VncInteractiveImage\Domain\Repository\InteractiveImageRepository;
use Vancado\VncInteractiveImage\Domain\Model\InteractiveImage;
use Psr\Http\Message\ResponseInterface;

class InteractiveImageController extends ActionController
{
    /**
     * @var InteractiveImageRepository
     */
    protected $interactiveImageRepository;

    public function __construct(InteractiveImageRepository $interactiveImageRepository)
    {
        $this->interactiveImageRepository = $interactiveImageRepository;
    }

    public function listAction(): ResponseInterface
    {
        $interactiveImages = $this->interactiveImageRepository->findAll();
        $this->view->assign('interactiveImages', $interactiveImages);
        return $this->htmlResponse();
    }

    public function showAction(InteractiveImage $interactiveImage): ResponseInterface
    {
        $this->view->assign('interactiveImage', $interactiveImage);
        return $this->htmlResponse();
    }
}
