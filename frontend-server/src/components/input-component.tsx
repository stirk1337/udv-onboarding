import { ChangeEvent } from "react";

type InputComponentProps = {
    name: string,
    icon: string,
    value: string,
    placeholder: string,
    type: string
    onchange: (evt: ChangeEvent<HTMLInputElement>) => void
}

function InputComponent({name, icon, value,placeholder, type, onchange}: InputComponentProps) {
    return ( 
        <>
            <label htmlFor="email">{name}</label>
            <div className="label-container">
                <img src={icon} alt="" width={26} height={26}></img>
                <input required type={type} name="email" placeholder={placeholder} value={value} onChange={onchange}></input>
            </div>
        </>
     );
}

export default InputComponent;