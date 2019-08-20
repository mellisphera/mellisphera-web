export const NOTIF_MSG = {
        SUCCESS: {
            FR: {
                CHANGE_NAME_DEMO_APIARY: 'Nom modifié',
                READ_ALL_ALERTS_HIVE : 'Alertes lues'


            },
            EN: {
                CHANGE_NAME_DEMO_APIARY: 'Name updated',
                READ_ALL_ALERTS_HIVE : 'Alerts read'

            }
        },
        FAIL: {
            FR: {
                AUTH_WRITE_APIARY: 'Vous n\'avez pas le droit de modifier le rucher de démo.',
                NO_DELETE_RIGHT: 'Vous ne pouvez pas supprimer le dernier rucher',
                AUTH_WRITE_HIVE: 'Vous n\'avez pas le droit de modifier cette ruche',
                AUTH_WRITE_NOTES: 'Vous n\'avez pas le droit de modifier les notes de ce rucher',
                AUTH_WRITE_NOTES_HIVE: 'VOus n\'avez pas le droit d\'écrire ici'
            },
            EN: {
                AUTH_WRITE_APIARY: 'You are not allowed to modify the demonstration apiary.',
                NO_DELETE_RIGHT: 'You can\'t delete the last apiary',
                AUTH_WRITE_HIVE: 'You are not allowed to modify this hive',
                AUTH_WRITE_NOTES: 'You are not allowed to write notes in this apiary',
                AUTH_WRITE_NOTES_HIVE: 'You are not allowed to write here'
            }
        }
}
export enum NotifList{
    AUTH_WRITE_APIARY = 'AUTH_WRITE_APIARY',
    NO_DELETE_RIGHT = 'NO_DELETE_RIGHT',
    AUTH_WRITE_HIVE = 'AUTH_WRITE_HIVE',
    CHANGE_NAME_DEMO_APIARY = 'CHANGE_NAME_DEMO_APIARY',
    AUTH_WRITE_NOTES = 'AUTH_WRITE_NOTES',
    AUTH_WRITE_NOTES_HIVE = 'AUTH_WRITE_NOTES_HIVE',
    READ_ALL_ALERTS_HIVE = 'READ_ALL_ALERTS_HIVE'

}