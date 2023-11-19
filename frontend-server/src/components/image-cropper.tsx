import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { CropperRef, Cropper, CircleStencil } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css'
import { useAppDispatch } from './hooks';
import { updateImage } from './store/api-actions/patch-action';

interface Image {
    type?: string;
    src: string;
}

type ImageCropperProps = {
    onClickExit: () => void
}

function ImageCropper({onClickExit}: ImageCropperProps) {
    const dispatch = useAppDispatch()
    const cropperRef = useRef<CropperRef>(null);
    const [image, setImage] = useState<Image | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    const onUpload = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };
    
    const onChange = (cropper: CropperRef) => {
        console.log(cropper.getCoordinates(), cropper.getCanvas());
    };

    const onCrop = () => {
        if (cropperRef.current) {
            imageToFile(cropperRef.current.getCanvas({
                height: 256,
                width: 256,
        })?.toDataURL() || '')
        }
    };

    async function imageToFile(image: string){
        const file = await url2File(image, 'profile-logo.png')
        dispatch(updateImage({file: file}))
        onClickExit()
    }

    async function url2File(url: string, fileName: string){
        const blob = await (await fetch(url)).blob()
        return new File([blob], fileName, {type: blob.type})
    }

    const onLoadImage = (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if (files && files[0]) {
            const blob = URL.createObjectURL(files[0]);
            setImage({
                src: blob,
                type: files[0].type
            })
        }
        event.target.value = '';
    };

    useEffect(() => {
        return () => {
            if (image && image.src) {
                URL.revokeObjectURL(image.src);
            }
        };
    }, [image]);
    
    return (
        <div className='update-image'>
            <div className="update-image-header">
                <button onClick={onClickExit}>
                    <img src="/close-dialog-icon.svg" alt="закрыть окно" width={67} height={40}></img>
                </button>
                <p>Загрузка новой фотографии</p>
            </div>
            {!image && 
                <> 
                    <div className='update-image-content'>
                        <p>Вы можете загрузить изображении в форматах: PNG, JPEG</p>
                        <div className="button" onClick={onUpload}>
                            <input ref={inputRef} type="file" accept="image/*" onChange={onLoadImage} />
                            Выбрать файл
                        </div>
                    </div>
                    <div className='update-image-footer'>
                        <p>Если возникают проблемы с загрузкой попробуйте выбрать фотографию меньшего размера</p>
                    </div>
                </>}
            {image && <div className='edit-image'>
                <Cropper
                    ref={cropperRef}
                    src={image?.src}
                    onChange={onChange}
                    stencilComponent={CircleStencil}
                    className={'cropper'}
                />
                <button onClick={onCrop}>Сохранить</button>
            </div>}
        </div>
    )
}

export default ImageCropper;