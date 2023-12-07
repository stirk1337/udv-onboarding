import ProgressBar from "@ramonak/react-progress-bar";

type ProgressBarComponentProps = {
    percentage: number
}

function ProgressBarComponent({percentage}: ProgressBarComponentProps) {
    return ( 
        <>
            <ProgressBar completed={percentage} isLabelVisible={false} bgColor={"#00C996"} baseBgColor={"#5B5B5B"} height={'16px'} animateOnRender={true} />
        </>
     );
}

export default ProgressBarComponent;