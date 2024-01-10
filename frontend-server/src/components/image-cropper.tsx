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
    isOpen: boolean;
}

function ImageCropper({onClickExit, isOpen}: ImageCropperProps) {
    const dispatch = useAppDispatch()
    const cropperRef = useRef<CropperRef>(null);
    const [image, setImage] = useState<Image | null>(null);
    const [errorMessage, setErrorMessage] = useState('')

    const inputRef = useRef<HTMLInputElement>(null);

    const onUpload = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
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
        setImage(null)
        onClickExit()
    }

    async function url2File(url: string, fileName: string){
        const blob = await (await fetch(url)).blob()
        return new File([blob], fileName, {type: blob.type})
    }

    const onLoadImage = (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if (files && files[0]) {
            if(files[0].type.split('/')[0] !== 'image'){
                setErrorMessage('Этот формат файлов не поддерживается')
                return
            }
            else{
                setErrorMessage('')
            }
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
        <div className='update-image' style={{
            opacity: !isOpen ? "0" : "1",
            transition: "all .5s",
            visibility: !isOpen ? "hidden" : "visible",
          }}>
            <div className="update-image-header">
                <button onClick={()=> {setImage(null); onClickExit()}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                            <path d="M29 2L2 29M2.00006 2L29 29" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                </button>
                <p>Загрузка новой фотографии</p>
            </div>
            {!image && 
                <> 
                    <div className='update-image-content'>
                        <p>Вы можете загрузить любое изображение!</p>
                        <div className="button" onClick={onUpload}>
                            <input ref={inputRef} type="file" accept="image/*" onChange={onLoadImage} />
                            Выбрать файл
                        </div>
                        <span className="error-message">{errorMessage}</span>
                    </div>
                    <div className='update-image-footer'>
                        <p>Если возникают проблемы с загрузкой попробуйте выбрать фотографию меньшего размера</p>
                    </div>
                </>}
            {image && isOpen && <div className='edit-image'>
                <Cropper
                    ref={cropperRef}
                    src={image?.src}
                    stencilComponent={CircleStencil}
                    className={'cropper'}
                />
                <button onClick={onCrop}>Сохранить</button>
            </div>}
        </div>
    )
}

export default ImageCropper;