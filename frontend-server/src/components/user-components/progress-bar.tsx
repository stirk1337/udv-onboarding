import ProgressBar from "@ramonak/react-progress-bar";

function ProgressBarComponent() {
    return ( 
        <>
            <ProgressBar completed={60} isLabelVisible={false} bgColor={"#00C996"} baseBgColor={"#5B5B5B"} height={'16px'} animateOnRender={true} />
        </>
     );
}

export default ProgressBarComponent;