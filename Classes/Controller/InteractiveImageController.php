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

    public function showAction(): ResponseInterface
    {
        // get content element uid
        $uid = (int) $this->request->getAttribute('currentContentObject')->data['uid'];

        // load content item via interactive image repository
        /** @var InteractiveImage $interactiveImage */
        $interactiveImage = $this->interactiveImageRepository->findByUid($uid);

        $this->view->assign('interactiveImage', $interactiveImage);
        return $this->htmlResponse();
    }
}
