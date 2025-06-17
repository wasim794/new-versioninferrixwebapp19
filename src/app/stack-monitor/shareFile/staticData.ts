// tslint:disable-next-line:class-name
export class staticAllData {
  public stackMonitorIds = [
    'com.inferrix.infix.db.dao.DataPointDao.COUNT',
    'com.inferrix.infix.db.dao.DataSourceDao.COUNT',
    'com.inferrix.stack.dao.DashboardDao.COUNT',
    'com.inferrix.infix.db.dao.UserDao.COUNT',
    'com.inferrix.stack.dao.WatchListDao.COUNT',
    'com.inferrix.infix.db.dao.PublisherDao.COUNT',
    'com.inferrix.infix.db.dao.mesh.MeshNodeInfoDao.COUNT'
  ];
  public stackWirelessQualityIds = [
    'system.net.wireless.quality.link',
    'system.net.wireless.quality.level',
    'system.net.wireless.quality.noise'
  ];
  public systemMetricsIds = [
    'stack.system.uptime',
    'system.LOAD_AVERAGE',
    'os.cpu_load.process',
    'os.cpu_load.system',
    'runtime.uptime'
  ];
  public jvmMemoryIds = [
    'java.lang.Runtime.maxMemory',
    'java.lang.Runtime.usedMemory',
    'java.lang.Runtime.freeMemory',
    'java.lang.Runtime.availableProcessors'
  ];
  public stackDataBaseIds = [
    'com.inferrix.stack.service.StackMonitoringService.dbActiveConnections',
    'com.inferrix.stack.service.StackMonitoringService.dbIdleConnections'
  ];
  public stackThreadMetricsIds = [
    'com.inferrix.stack.rt.maint.WorkItemMonitor.highPriorityActive',
    'com.inferrix.stack.rt.maint.WorkItemMonitor.highPriorityScheduled',
    'com.inferrix.stack.rt.maint.WorkItemMonitor.highPriorityWaiting',
    'com.inferrix.stack.rt.maint.WorkItemMonitor.mediumPriorityActive',
    'com.inferrix.stack.rt.maint.WorkItemMonitor.mediumPriorityWaiting',
    'com.inferrix.stack.rt.maint.WorkItemMonitor.lowPriorityActive',
    'com.inferrix.stack.rt.maint.WorkItemMonitor.lowPriorityWaiting'
  ];
}
