export const NOTIF_MSG = {
        SUCCESS: {
            FR: {

            },
            EN: {

            }
        },
        FAIL: {
            FR: {
                AUTH_WRITE_APIARY: 'Vous n\'avez pas le droit de modifier ce rucher',
                AUTH_WRITE_HIVE: 'Vous n\'avez pas le droit de modifier cette ruche',
                CHANGE_NAME_DEMO_APIARY: 'Nom modifié'
            },
            EN: {
                AUTH_WRITE_APIARY: 'You are not allowed to modify this apiary',
                AUTH_WRITE_HIVE: 'you are not allowed to modify this hive',
                CHANGE_NAME_DEMO_APIARY: 'Name updated'
            }
        }
}
export enum NotifList{
    AUTH_WRITE_APIARY = 'AUTH_WRITE_APIARY',
    AUTH_WRITE_HIVE = 'AUTH_WRITE_HIVE',
    CHANGE_NAME_DEMO_APIARY = 'CHANGE_NAME_DEMO_APIARY'

}