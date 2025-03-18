<?php

declare(strict_types=1);

namespace Vancado\VncInteractiveImage\Form\Element;

use TYPO3\CMS\Backend\Form\Element\AbstractFormElement;
use TYPO3\CMS\Backend\Form\NodeFactory;
use TYPO3\CMS\Core\Imaging\IconFactory;
use TYPO3\CMS\Core\Imaging\ImageManipulation\CropVariantCollection;
use TYPO3\CMS\Core\Resource\Exception\FileDoesNotExistException;
use TYPO3\CMS\Core\Resource\FileReference;
use TYPO3\CMS\Core\Resource\FileRepository;
use TYPO3\CMS\Core\Resource\ResourceFactory;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\StringUtility;
use TYPO3\CMS\Extbase\Service\ImageService;
use TYPO3\CMS\Extbase\Utility\DebuggerUtility;
use TYPO3\CMS\Extbase\Utility\LocalizationUtility;
use Vancado\VncInteractiveImage\Domain\Model\InteractiveImage;
use Vancado\VncInteractiveImage\Domain\Model\Mark;
use Vancado\VncInteractiveImage\Domain\Repository\InteractiveImageRepository;

class SetMarker extends AbstractFormElement
{
    /**
     * Container objects give $nodeFactory down to other containers.
     *
     * @param NodeFactory $nodeFactory
     * @param array $data
     */
    public function __construct(NodeFactory $nodeFactory, array $data = [])
    {
        if (method_exists(AbstractFormElement::class, '__construct')) {
            parent::__construct($nodeFactory, $data);
        }
        $this->iconFactory = GeneralUtility::makeInstance(IconFactory::class);
    }

    public function render(): array
    {
        /** @var FileRepository $fileRepository */
        $fileRepository = GeneralUtility::makeInstance(FileRepository::class);
        /** @var ImageService $imageService */
        $imageService = GeneralUtility::makeInstance(ImageService::class);
        /** @var InteractiveImageRepository $interactiveImageRepository */
        $interactiveImageRepository = GeneralUtility::makeInstance(InteractiveImageRepository::class);

        $row = $this->data['databaseRow'];
        $parameterArray = $this->data['parameterArray'];
        $image = null;
        $iconUrl = null;
        $iconFormElement = null;
        /** @var InteractiveImage $interactiveImage */
        $interactiveImage = $interactiveImageRepository->findByUidAndIgnoreHidden((int)$row['uid']);

        try {
            /** @var FileReference[] $fileObjects */
            $fileObjects = $fileRepository->findByRelation(
                'tt_content',
                'tx_vncinteractiveimage_image',
                (int)$row['uid']
            );
        } catch (FileDoesNotExistException $e) {
            return ['html' => '<div>' . LocalizationUtility::translate(
                    'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vnc_interactive_image_vncinteractiveimage.error.no_image_file'
                ) . '</div>'];
        }

        if (sizeof($fileObjects) === 0) {
            return ['html' => '<div>' . LocalizationUtility::translate(
                    'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vnc_interactive_image_vncinteractiveimage.error.no_image_file'
                ) . '</div>'];
        } else {
            try {
                $fileObject = $fileObjects[0];
                $image = $imageService->getImage($fileObject->getOriginalFile()->getPublicUrl(), null, false);
                $cropVariantCollection = CropVariantCollection::create((string)$fileObject->getReferenceProperty('crop'));

                $cropArea = $cropVariantCollection->getCropArea('default');
                $processingInstructions = [
                    'crop' => $cropArea->makeAbsoluteBasedOnFile($image),
                ];
                $processedImage = $imageService->applyProcessingInstructions($image, $processingInstructions);
                $imageUrl = $imageService->getImageUri($processedImage);
            } catch (FileDoesNotExistException $e) {
                return ['html' => '<div>' . LocalizationUtility::translate(
                        'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vnc_interactive_image_vncinteractiveimage.error.no_image_file'
                    ) . '</div>'];
            }
        }

        $fieldInformationResult = $this->renderFieldInformation();
        $fieldInformationHtml = $fieldInformationResult['html'];
        $resultArray = $this->mergeChildReturnIntoExistingResult($this->initializeResultArray(), $fieldInformationResult, false);

        $fieldId = StringUtility::getUniqueId('formengine-textarea-');

        $attributes = [
            'id' => $fieldId,
            'name' => htmlspecialchars($parameterArray['itemFormElName']),
            'data-formengine-input-name' => htmlspecialchars($parameterArray['itemFormElName'])
        ];

        $classes = [
            'form-control',
            't3js-formengine-textarea',
            'formengine-textarea',
        ];
        $itemValue = $parameterArray['itemFormElValue'];
        $attributes['class'] = implode(' ', $classes);

        if ($interactiveImage->getTxVncinteractiveimageIconMode() === 'same') {
            try {
                /** @var FileReference[] $fileObjects */
                $fileObjects = $fileRepository->findByRelation(
                    'tt_content',
                    'tx_vncinteractiveimage_icon',
                    (int)$row['uid']
                );
            } catch (FileDoesNotExistException $e) {
                return ['html' => '<div>' . LocalizationUtility::translate(
                        'LLL:EXT:vnc_interactive_image/Resources/Private/Language/locallang_db.xlf:tx_vnc_interactive_image_vncinteractiveimage.error.no_image_file'
                    ) . '</div>'];
            }

            if (sizeof($fileObjects) > 0 && $interactiveImage->getTxVncinteractiveimageIconSelection() === 'upload') {
                $fileObject = $fileObjects[0];
                $iconUrl = $fileObject->getOriginalFile()->getPublicUrl();
            }

            if ($interactiveImage->getTxVncinteractiveimageIconFormelement() != '' && $interactiveImage->getTxVncinteractiveimageIconSelection() === 'formelement') {
                $iconUrl = '';
                $iconFormElement = '<i class="' . $interactiveImage->getTxVncinteractiveimageIconFormelement() . '"></i>';
            }
        }

        $markers = [];
        if ($interactiveImage) {
            /** @var Mark $mark */
            $count = 0;
            foreach ($interactiveImage->getTxVncinteractiveimageMarks() as $mark) {
                $left = $mark->getPositionX();
                $top = $mark->getPositionY();

                $numberDiv = $interactiveImage->getTxVncinteractiveimageIconMode() === 'numbers' ?
                    '<div class="number">' . (++$count) . '</div>' : '';

                $sameIconContent = $interactiveImage->getTxVncinteractiveimageIconMode() === 'same' && $iconUrl ?
                    '<img src="' . $iconUrl . '" />' : '';

                $differentIcon = $interactiveImage->getTxVncinteractiveimageIconMode() === 'different' ?
                    $this->getDifferentIcon($mark) : '';

                $markers[] = '<div
                    title="' . htmlentities($mark->getTitle()) . '"
                    class="setMarkerMarkers set-marker-marker"
                    data-mark-uid="' . $mark->getUid() . '"
                    data-mark-title="' . htmlentities($mark->getTitle()) . '"
                    data-mark-bodytext="' . htmlentities($mark->getBodytext()) . '"
                    data-mark-position-x="' . (string)($mark->getPositionX() / 100) . '"
                    data-mark-position-y="' . (string)($mark->getPositionY() / 100) . '"
                    style="
                        left: calc(' . $left . '% - 22px);
                        top: calc(' . $top . '% - 22px);
                    "
                    draggable="true"
                >
                    ' . $numberDiv . '
                    ' . $sameIconContent . '
                    ' . $iconFormElement . '
                    ' . $differentIcon . '
                </div>';
            }
        }

        $html = [];
        $versionInformation = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\TYPO3\CMS\Core\Information\Typo3Version::class);
        if ($versionInformation->getMajorVersion() > 12) {
            $html[] = $this->renderLabel($fieldId);
        }
        $html[] = '<div class="formengine-field-item t3js-formengine-field-item">';
        $html[] = $fieldInformationHtml;
        $html[] = '<div class="form-wizards-wrap">';
        $html[] = '<div class="form-wizards-element">';
        $html[] = '<div id="setMarkerImageMap" class="form-control-wrap">';
        $html[] = '<img draggable="false" id="setMarkerImage" style="width: 100%; height: auto; cursor: crosshair;" src="' . $imageUrl . '" />';
        $html[] = implode(LF, $markers);
        $html[] = '</div>';
        $html[] = '</div>';
        $html[] = '</div>';
        $html[] = '</div>';
        $resultArray['html'] = implode(LF, $html);

        return $resultArray;
    }

    private function getDifferentIcon(Mark $mark): string
    {
        /** @var FileRepository $fileRepository */
        $fileRepository = GeneralUtility::makeInstance(FileRepository::class);

        if (empty($mark->getUid())) {
            return '';
        }

        try {
            /** @var FileReference[] $fileObjects */
            $fileObjects = $fileRepository->findByRelation(
                'tx_vncinteractiveimage_domain_model_mark',
                'icon',
                (int)$mark->getUid()
            );
        } catch (FileDoesNotExistException $e) {
            return '';
        }

        if (sizeof($fileObjects) > 0) {
            $fileObject = $fileObjects[0];
            $iconUrl = $fileObject->getOriginalFile()->getPublicUrl();
            return '<img src="' . $iconUrl . '" />';
        }

        if ($mark->getIconFormelement() != '') {
            return '<i class="' . $mark->getIconFormelement() . '"></i>';
        }

        return '';
    }
}
