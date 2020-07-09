export declare const chartHelpText: {
    line: string;
    bar: string;
    scatter: string;
    grid: string;
    network: string;
    summary: string;
    hexbin: string;
    parallel: string;
    hierarchy: string;
};
export declare type ChartOptionTypes = "metric1" | "metric2" | "metric3" | "metric4" | "dim1" | "dim2" | "dim3" | "timeseriesSort" | "networkLabel";
export declare type ExplorationTypes = ChartOptionTypes | "lineDimensions" | "lineType" | "areaType" | "networkType" | "summaryType" | "hierarchyType" | "nestingDimensions" | "barDimensions" | "trendLine" | "barGrouping" | "marginalGraphics";
export declare const controlHelpText: {
    [key in ExplorationTypes]?: {
        [key: string]: string;
    } | string;
};
