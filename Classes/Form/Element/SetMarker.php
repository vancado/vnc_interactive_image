<?php

declare(strict_types = 1);

namespace Vancado\VncInteractiveImage\Form\Element;

use TYPO3\CMS\Backend\Form\Element\AbstractFormElement;
use TYPO3\CMS\Backend\Form\NodeFactory;
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
    public function render():array
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
        /** @var InteractiveImage $interactiveImage */
        $interactiveImage = $interactiveImageRepository->findByUid((int) $row['uid']);

        try {
            /** @var FileReference[] $fileObjects */
            $fileObjects = $fileRepository->findByRelation(
                'tt_content',
                'tx_vncinteractiveimage_image',
                $row['uid']
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

        $attributes['placeholder'] = 'Enter special value for element "'.htmlspecialchars(trim((string)$row['uid']));

        $classes = [
            'form-control',
            't3js-formengine-textarea',
            'formengine-textarea',
        ];
        $itemValue = $parameterArray['itemFormElValue'];
        $attributes['class'] = implode(' ', $classes);

        $markers = [];
        if ($interactiveImage) {
            /** @var Mark $mark */
            foreach ($interactiveImage->getTxVncinteractiveimageMarks() as $mark) {
                $left = $mark->getPositionX() * 100;
                $top = $mark->getPositionY() * 100;
                $markers[] = '<div title="' . htmlentities($mark->getText()) . '" class="setMarkerMarkers" data-mark-uid="' . $mark->getUid() . '" style="
                    width:1px;
                    height:1px;
                    background-color:#f00;
                    position:absolute;
                    left: calc(' . $left . '% - 14.5px);
                    top: calc(' . $top .'% - 14.5px);
                    border: 15px solid #f00;
                    border-radius: 100%;
                    outline: 2px solid #fff;
                    -webkit-border-radius: 100%;
                    cursor: pointer;
                "></div>';
            }
        }

        $html = [];
        $html[] = '<div class="formengine-field-item t3js-formengine-field-item">';
        $html[] = $fieldInformationHtml;
        $html[] =   '<div class="form-wizards-wrap">';
        $html[] =      '<div class="form-wizards-element">';
        $html[] =         '<div class="form-control-wrap" style="position:relative;">';
        $html[] =            '<img id="setMarkerImage" style="width: 100%; height: auto; cursor: crosshair;" src="' . $imageUrl . '" />';
        $html[] = implode(LF, $markers);
        $html[] =         '</div>';
        $html[] =      '</div>';
        $html[] =   '</div>';
        $html[] = '</div>';
        $resultArray['html'] = implode(LF, $html);

        return $resultArray;
    }
}