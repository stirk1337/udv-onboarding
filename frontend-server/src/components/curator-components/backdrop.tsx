type BackDropProps = {
    closeDialog: () => void;
    isHaveBackground: boolean;
}

function BackDrop({closeDialog, isHaveBackground}: BackDropProps) {
    return ( 
        <div onClick={closeDialog} className={isHaveBackground ? "backdrop" : "backdrop without-color"}></div>
     );
}

export default BackDrop;