export  enum DuplicateHandling {
  /**
   * Duplicates are not allowed. This should be the case for all event types where there is an automatic return to
   * normal.
   */
  DO_NOT_ALLOW,

  /**
   * Duplicates are ignored. This should be the case where the initial occurrence of an event is really the only
   * thing of interest to a user. For example, the initial error in a data source is usually what is most useful
   * in diagnosing a problem.
   */
  IGNORE,

  /**
   * Duplicates are ignored only if their message is the same as the existing.
   */
  IGNORE_SAME_MESSAGE,

  /**
   * Duplicates are allowed. The change detector uses this so that user's can acknowledge every change the point
   * experiences.
   */
  ALLOW
}
