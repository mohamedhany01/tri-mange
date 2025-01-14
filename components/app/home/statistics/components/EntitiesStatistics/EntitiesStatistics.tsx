import React, { memo } from "react";

import { BoxList } from "../StatisticBoxList/BoxList";
import { StatisticBoxProps } from "../StatisticBoxList/StatisticBox";

interface EntitiesStatisticsProps {
  statistics: StatisticBoxProps[];
}

const EntitiesStatistics: React.FC<EntitiesStatisticsProps> = ({
  statistics,
}) => {
  return <BoxList list={statistics} />;
};

export default memo(EntitiesStatistics);
