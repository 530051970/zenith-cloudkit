import { TableProps } from "@cloudscape-design/components";

export const renderAriaLive: TableProps['renderAriaLive'] = ({ firstIndex, lastIndex, totalItemsCount }) =>
  `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`;