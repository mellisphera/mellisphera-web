export const NOTIF_MSG = {
        SUCCESS: {
            FR: {
                CHANGE_NAME_DEMO_APIARY: 'Nom modifié'


            },
            EN: {
                CHANGE_NAME_DEMO_APIARY: 'Name updated'

            }
        },
        FAIL: {
            FR: {
                AUTH_WRITE_APIARY: 'Vous n\'avez pas le droit de modifier ce rucher',
                AUTH_WRITE_HIVE: 'Vous n\'avez pas le droit de modifier cette ruche',
                AUTH_WRITE_NOTES: 'Vous n\'avez pas le droit de modifier les notes de ce rucher',
                AUTH_WRITE_NOTES_HIVE: 'VOus n\'avez pas le droit d\'écrire ici'
            },
            EN: {
                AUTH_WRITE_APIARY: 'You are not allowed to modify this apiary',
                AUTH_WRITE_HIVE: 'You are not allowed to modify this hive',
                AUTH_WRITE_NOTES: 'You are not allowed to write notes in this apiary',
                AUTH_WRITE_NOTES_HIVE: 'You are not allowed to write here'
            }
        }
}
export enum NotifList{
    AUTH_WRITE_APIARY = 'AUTH_WRITE_APIARY',
    AUTH_WRITE_HIVE = 'AUTH_WRITE_HIVE',
    CHANGE_NAME_DEMO_APIARY = 'CHANGE_NAME_DEMO_APIARY',
    AUTH_WRITE_NOTES = 'AUTH_WRITE_NOTES',
    AUTH_WRITE_NOTES_HIVE = 'AUTH_WRITE_NOTES_HIVE'

}