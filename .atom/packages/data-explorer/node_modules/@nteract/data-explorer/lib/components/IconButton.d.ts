import * as React from "react";
interface IconButtonProps {
    message: string;
    onClick: () => void;
    children?: React.ReactNode;
    title: string;
    selected: boolean;
}
export declare class IconButton extends React.PureComponent<IconButtonProps> {
    render(): JSX.Element;
}
export {};
