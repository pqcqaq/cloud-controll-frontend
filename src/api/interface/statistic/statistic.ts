export namespace IStatistic {
  // 查询条件
    export type HomePageStatistic = {
        total: number;
        offline: number;
        online: number;
        standby: number;
        producing: number;
        warning: number;
  }
}