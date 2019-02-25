export interface NotifierAction {
    /**
     * Action payload containing all information necessary to process the action (optional)
     */
    payload?: any;
    /**
     * Action type
     */
    type: 'SHOW' | 'HIDE' | 'HIDE_ALL' | 'HIDE_NEWEST' | 'HIDE_OLDEST';
}
