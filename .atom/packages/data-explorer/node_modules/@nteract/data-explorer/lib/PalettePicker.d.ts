import * as React from "react";
interface Props {
    colors: string[];
    updateColor: (colors: string[]) => void;
}
interface State {
    colors: string;
    selectedColor: string;
    open: boolean;
    selectedPosition: number;
}
declare class PalettePicker extends React.PureComponent<Props, State> {
    static defaultProps: {
        metadata: {};
        height: number;
    };
    constructor(props: Props);
    openClose: () => void;
    handleChange: (color: string, position: number) => void;
    pickerChange: (color: {
        hex: string;
    }) => void;
    colorsFromTextarea: () => void;
    updateTextArea: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    render(): JSX.Element;
}
export default PalettePicker;
