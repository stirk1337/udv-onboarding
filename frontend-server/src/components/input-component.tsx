import { ChangeEvent } from "react";

type InputComponentProps = {
    name: string,
    icon: string,
    value: string,
    placeholder: string,
    type: string
    disabled?: boolean,
    onchange: (evt: ChangeEvent<HTMLInputElement>) => void
    onBlur?: () => void
}

function InputComponent({name, icon, value,placeholder, type, disabled=false, onchange, onBlur=() => {}}: InputComponentProps) {
    return ( 
        <div className="input-block">
            <label htmlFor="email">{name}</label>
            <div className="label-container">
                {icon && <img src={icon} alt="" width={26} height={26}></img>}
                <input required type={type} name="email" placeholder={placeholder} value={value} disabled={disabled} onChange={onchange} onBlur={onBlur}></input>
            </div>
        </div>
     );
}

export default InputComponent;