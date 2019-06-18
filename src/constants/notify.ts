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
                AUTH_WRITE_HIVE: 'Vous n\'avez pas le droit de modifier cette ruche'
            },
            EN: {
                AUTH_WRITE_APIARY: 'You are not allowed to modify this apiary',
                AUTH_WRITE_HIVE: 'you are not allowed to modify this hive'
            }
        }
}
export enum NotifList{
    AUTH_WRITE_APIARY = 'AUTH_WRITE_APIARY',
    AUTH_WRITE_HIVE = 'AUTH_WRITE_HIVE',

}