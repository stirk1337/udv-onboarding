import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { ProductRoles, Products } from "../../types";
import { useAppDispatch } from "../hooks";
import { updateGroupToPlanet } from "../store/api-actions/patch-action";

type SelectGroupFormProps = {
    idBlock: number,
}

function SelectGroupForm({idBlock}: SelectGroupFormProps) {
    const dispatch = useAppDispatch()
    const [product, setProduct] = useState('')
    const [role, setRole] = useState('')

    useEffect(() => {
        setProduct('')
        setRole('')
    }, [idBlock])

    function productSelectHandler(evt: ChangeEvent<HTMLSelectElement>){
        setProduct(evt.target.value)
    }

    function roleSelectHandler(evt: ChangeEvent<HTMLSelectElement>){
        setRole(evt.target.value)
    }

    function submitHandle(evt: SyntheticEvent){
        evt.preventDefault();
        dispatch(updateGroupToPlanet({product: product, productRole: role, planetId: idBlock}))
    }


    return ( 
        <form onSubmit={submitHandle}>
            <select name="Выбор продукта" required value={product} onChange={productSelectHandler}>
                <option value="" disabled>Выбор продукта</option>
                <option value="all">Все</option>
                {(Object.values(Products) as Array<keyof typeof Products>).map((product) => <option key={product} value={product}>{product}</option>)}
            </select>
            <select name="Выбор роли" required value={role} onChange={roleSelectHandler}>
                <option value="" disabled>Выбор роли</option>
                <option value="all">Все</option>
                {(Object.values(ProductRoles) as Array<keyof typeof ProductRoles>).map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
            <button type="submit">Отправить</button>
        </form>
     );
}

export default SelectGroupForm;